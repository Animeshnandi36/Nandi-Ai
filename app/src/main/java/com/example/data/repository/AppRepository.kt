package com.example.data.repository

import com.example.data.local.AppDatabase
import com.example.data.model.ChatMessageEntity
import com.example.data.model.ChatSessionEntity
import com.example.data.model.GeneratedChartEntity
import com.example.data.model.GeneratedImageEntity
import com.example.data.model.ProjectEntity
import kotlinx.coroutines.flow.Flow
import java.util.UUID

class AppRepository(private val database: AppDatabase) {
    private val chatDao = database.chatDao()
    private val projectDao = database.projectDao()
    private val imageDao = database.imageDao()
    private val chartDao = database.chartDao()

    // Chats
    val allSessions: Flow<List<ChatSessionEntity>> = chatDao.getAllSessions()

    fun getMessagesForSession(sessionId: String): Flow<List<ChatMessageEntity>> {
        return chatDao.getMessagesForSession(sessionId)
    }

    suspend fun createNewSession(title: String = "New Conversation", projectTag: String = "General"): String {
        val id = UUID.randomUUID().toString()
        val session = ChatSessionEntity(
            id = id,
            title = title,
            projectTag = projectTag
        )
        chatDao.insertSession(session)
        return id
    }

    suspend fun updateSession(session: ChatSessionEntity) {
        chatDao.updateSession(session)
    }

    suspend fun deleteSession(sessionId: String) {
        chatDao.deleteMessagesForSession(sessionId)
        chatDao.deleteSession(sessionId)
    }

    suspend fun addMessage(message: ChatMessageEntity): Long {
        val id = chatDao.insertMessage(message)
        val session = chatDao.getSessionById(message.sessionId)
        if (session != null) {
            val preview = message.content.take(80)
            val updatedTitle = if (session.title == "New Conversation" && message.role == "user") {
                message.content.take(30).trim()
            } else session.title

            chatDao.updateSession(
                session.copy(
                    updatedAt = System.currentTimeMillis(),
                    preview = preview,
                    title = updatedTitle
                )
            )
        }
        return id
    }

    // Projects
    val allProjects: Flow<List<ProjectEntity>> = projectDao.getAllProjects()

    suspend fun createProject(name: String, description: String, iconName: String, colorHex: String): String {
        val id = UUID.randomUUID().toString()
        val project = ProjectEntity(
            id = id,
            name = name,
            description = description,
            iconName = iconName,
            colorHex = colorHex
        )
        projectDao.insertProject(project)
        return id
    }

    suspend fun deleteProject(projectId: String) {
        projectDao.deleteProject(projectId)
    }

    // Images
    val allImages: Flow<List<GeneratedImageEntity>> = imageDao.getAllImages()

    suspend fun saveGeneratedImage(prompt: String, base64OrUrl: String, model: String = "black-forest-labs/FLUX.1-dev", ratio: String = "1:1"): Long {
        return imageDao.insertImage(
            GeneratedImageEntity(
                prompt = prompt,
                imageBase64OrUrl = base64OrUrl,
                modelUsed = model,
                aspectRatio = ratio
            )
        )
    }

    suspend fun toggleImageFavorite(id: Long, isFavorite: Boolean) {
        imageDao.setFavorite(id, isFavorite)
    }

    suspend fun deleteImage(id: Long) {
        imageDao.deleteImage(id)
    }

    // Charts
    val allCharts: Flow<List<GeneratedChartEntity>> = chartDao.getAllCharts()

    suspend fun saveGeneratedChart(chart: GeneratedChartEntity): Long {
        return chartDao.insertChart(chart)
    }

    suspend fun deleteChart(id: Long) {
        chartDao.deleteChart(id)
    }
}
