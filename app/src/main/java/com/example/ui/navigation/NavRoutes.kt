package com.example.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.ChatBubble
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.InsertDriveFile
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.Settings
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Home : Screen("home", "Home", Icons.Default.Home)
    object Chat : Screen("chat?sessionId={sessionId}", "AI Chat", Icons.Default.ChatBubble) {
        fun createRoute(sessionId: String? = null): String = if (sessionId != null) "chat?sessionId=$sessionId" else "chat"
    }
    object ImageStudio : Screen("image_studio", "Image Studio", Icons.Default.Image)
    object ChartStudio : Screen("chart_studio", "Chart Studio", Icons.Default.PieChart)
    object FileStudio : Screen("file_studio", "Files", Icons.Default.InsertDriveFile)
    object CodeStudio : Screen("code_studio", "Code", Icons.Default.Code)
    object Projects : Screen("projects", "Projects", Icons.Default.Folder)
    object History : Screen("history", "History", Icons.Default.History)
    object Settings : Screen("settings", "Settings", Icons.Default.Settings)
}

val bottomNavScreens = listOf(
    Screen.Home,
    Screen.Chat,
    Screen.ImageStudio,
    Screen.ChartStudio,
    Screen.CodeStudio
)
