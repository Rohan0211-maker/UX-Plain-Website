import { Server as NetServer } from "http"
import { NextApiRequest, NextApiResponse } from "next"
import { Server as SocketIOServer } from "socket.io"
import { prisma } from "./prisma"

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socketio",
      addTrailingSlash: false,
    })
    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      // Join analysis room
      socket.on("join-analysis", (analysisId: string) => {
        socket.join(`analysis-${analysisId}`)
        console.log(`Client ${socket.id} joined analysis ${analysisId}`)
      })

      // Leave analysis room
      socket.on("leave-analysis", (analysisId: string) => {
        socket.leave(`analysis-${analysisId}`)
        console.log(`Client ${socket.id} left analysis ${analysisId}`)
      })

      // Handle analysis progress updates
      socket.on("analysis-progress", async (data: { analysisId: string; progress: number; message: string }) => {
        try {
          await prisma.analysis.update({
            where: { id: data.analysisId },
            data: { progress: data.progress }
          })

          await prisma.analysisLog.create({
            data: {
              analysisId: data.analysisId,
              level: "INFO",
              message: data.message,
              data: { progress: data.progress }
            }
          })

          // Broadcast to all clients in the analysis room
          io.to(`analysis-${data.analysisId}`).emit("analysis-update", {
            analysisId: data.analysisId,
            progress: data.progress,
            message: data.message,
            timestamp: new Date().toISOString()
          })
        } catch (error) {
          console.error("Error updating analysis progress:", error)
        }
      })

      // Handle analysis completion
      socket.on("analysis-complete", async (data: { analysisId: string; result: any }) => {
        try {
          await prisma.analysis.update({
            where: { id: data.analysisId },
            data: {
              status: "COMPLETED",
              progress: 100,
              result: data.result,
              completedAt: new Date()
            }
          })

          // Broadcast completion to all clients in the analysis room
          io.to(`analysis-${data.analysisId}`).emit("analysis-complete", {
            analysisId: data.analysisId,
            result: data.result,
            timestamp: new Date().toISOString()
          })
        } catch (error) {
          console.error("Error completing analysis:", error)
        }
      })

      // Handle analysis error
      socket.on("analysis-error", async (data: { analysisId: string; error: string }) => {
        try {
          await prisma.analysis.update({
            where: { id: data.analysisId },
            data: { status: "FAILED" }
          })

          await prisma.analysisLog.create({
            data: {
              analysisId: data.analysisId,
              level: "ERROR",
              message: data.error,
              data: { error: data.error }
            }
          })

          // Broadcast error to all clients in the analysis room
          io.to(`analysis-${data.analysisId}`).emit("analysis-error", {
            analysisId: data.analysisId,
            error: data.error,
            timestamp: new Date().toISOString()
          })
        } catch (error) {
          console.error("Error handling analysis error:", error)
        }
      })

      // Handle real-time insights
      socket.on("insight-found", async (data: { analysisId: string; insight: any }) => {
        try {
          // Broadcast new insight to all clients in the analysis room
          io.to(`analysis-${data.analysisId}`).emit("new-insight", {
            analysisId: data.analysisId,
            insight: data.insight,
            timestamp: new Date().toISOString()
          })
        } catch (error) {
          console.error("Error broadcasting insight:", error)
        }
      })

      // Handle real-time recommendations
      socket.on("recommendation-found", async (data: { analysisId: string; recommendation: any }) => {
        try {
          // Broadcast new recommendation to all clients in the analysis room
          io.to(`analysis-${data.analysisId}`).emit("new-recommendation", {
            analysisId: data.analysisId,
            recommendation: data.recommendation,
            timestamp: new Date().toISOString()
          })
        } catch (error) {
          console.error("Error broadcasting recommendation:", error)
        }
      })

      // Handle user activity
      socket.on("user-activity", (data: { userId: string; activity: string; data?: any }) => {
        // Log user activity for analytics
        console.log("User activity:", data)
      })

      // Handle chat messages
      socket.on("chat-message", async (data: { analysisId: string; message: string; userId: string }) => {
        try {
          // Store chat message in database
          await prisma.analysisLog.create({
            data: {
              analysisId: data.analysisId,
              level: "INFO",
              message: `Chat: ${data.message}`,
              data: { 
                type: "chat",
                userId: data.userId,
                message: data.message
              }
            }
          })

          // Broadcast chat message to all clients in the analysis room
          io.to(`analysis-${data.analysisId}`).emit("chat-message", {
            analysisId: data.analysisId,
            message: data.message,
            userId: data.userId,
            timestamp: new Date().toISOString()
          })
        } catch (error) {
          console.error("Error handling chat message:", error)
        }
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })
  }

  res.end()
}

export default ioHandler 