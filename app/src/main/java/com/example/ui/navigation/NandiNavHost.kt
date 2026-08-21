package com.example.ui.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.navArgument
import com.example.ui.screens.chart.ChartStudioScreen
import com.example.ui.screens.chart.ChartViewModel
import com.example.ui.screens.chat.ChatScreen
import com.example.ui.screens.chat.ChatViewModel
import com.example.ui.screens.code.CodeStudioScreen
import com.example.ui.screens.files.FileStudioScreen
import com.example.ui.screens.history.HistoryScreen
import com.example.ui.screens.home.HomeScreen
import com.example.ui.screens.image.ImageStudioScreen
import com.example.ui.screens.image.ImageViewModel
import com.example.ui.screens.projects.ProjectsScreen
import com.example.ui.screens.settings.SettingsScreen
import com.example.ui.theme.CyberDarkCard
import com.example.ui.theme.CyberDarkSurface
import com.example.ui.theme.CyberDarkSurfaceVariant
import com.example.ui.theme.CyberGold
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.TextMutedDark

@Composable
fun NandiNavHost(
    navController: NavHostController,
    modifier: Modifier = Modifier
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val chatViewModel: ChatViewModel = viewModel()
    val imageViewModel: ImageViewModel = viewModel()
    val chartViewModel: ChartViewModel = viewModel()

    val showBottomNav = currentRoute in listOf(
        Screen.Home.route,
        Screen.Chat.route,
        Screen.ImageStudio.route,
        Screen.ChartStudio.route,
        Screen.CodeStudio.route
    )

    Scaffold(
        bottomBar = {
            if (showBottomNav) {
                Surface(
                    color = CyberDarkSurface,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    NavigationBar(
                        containerColor = Color.Transparent,
                        modifier = Modifier.height(58.dp)
                    ) {
                        bottomNavScreens.forEach { screen ->
                            val isSelected = currentRoute == screen.route
                            NavigationBarItem(
                                selected = isSelected,
                                onClick = {
                                    navController.navigate(screen.route) {
                                        popUpTo(navController.graph.findStartDestination().id) {
                                            saveState = true
                                        }
                                        launchSingleTop = true
                                        restoreState = true
                                    }
                                },
                                icon = {
                                    Icon(
                                        imageVector = screen.icon,
                                        contentDescription = screen.title,
                                        modifier = Modifier.size(20.dp)
                                    )
                                },
                                label = {
                                    Text(
                                        text = screen.title,
                                        fontSize = 10.sp,
                                        color = if (isSelected) NeonCyan else TextMutedDark
                                    )
                                },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = NeonCyan,
                                    unselectedIconColor = TextMutedDark,
                                    indicatorColor = Color(0xFF003852)
                                ),
                                modifier = Modifier.testTag("nav_item_${screen.title.lowercase().replace(" ", "_")}")
                            )
                        }
                    }
                }
            }
        },
        modifier = modifier.fillMaxSize()
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Home.route) {
                HomeScreen(
                    onNavigateToChat = { sessionId ->
                        sessionId?.let { chatViewModel.selectSession(it) }
                        navController.navigate(Screen.Chat.route)
                    },
                    onNavigateToImageStudio = { navController.navigate(Screen.ImageStudio.route) },
                    onNavigateToChartStudio = { navController.navigate(Screen.ChartStudio.route) },
                    onNavigateToFileStudio = { navController.navigate(Screen.FileStudio.route) },
                    onNavigateToCodeStudio = { navController.navigate(Screen.CodeStudio.route) },
                    onNavigateToProjects = { navController.navigate(Screen.Projects.route) },
                    onNavigateToHistory = { navController.navigate(Screen.History.route) },
                    onNavigateToSettings = { navController.navigate(Screen.Settings.route) }
                )
            }

            composable(
                route = Screen.Chat.route,
                arguments = listOf(navArgument("sessionId") {
                    type = NavType.StringType
                    nullable = true
                    defaultValue = null
                })
            ) { backStackEntry ->
                val sessionId = backStackEntry.arguments?.getString("sessionId")
                if (sessionId != null) {
                    chatViewModel.selectSession(sessionId)
                }
                ChatScreen(viewModel = chatViewModel)
            }

            composable(Screen.ImageStudio.route) {
                ImageStudioScreen(viewModel = imageViewModel)
            }

            composable(Screen.ChartStudio.route) {
                ChartStudioScreen(viewModel = chartViewModel)
            }

            composable(Screen.FileStudio.route) {
                FileStudioScreen()
            }

            composable(Screen.CodeStudio.route) {
                CodeStudioScreen()
            }

            composable(Screen.Projects.route) {
                ProjectsScreen(
                    onOpenProjectChat = { projectName ->
                        chatViewModel.createNewSession()
                        navController.navigate(Screen.Chat.route)
                    }
                )
            }

            composable(Screen.History.route) {
                HistoryScreen(
                    onSelectSession = { sessionId ->
                        chatViewModel.selectSession(sessionId)
                        navController.navigate(Screen.Chat.route)
                    },
                    onNewChat = {
                        chatViewModel.createNewSession()
                        navController.navigate(Screen.Chat.route)
                    }
                )
            }

            composable(Screen.Settings.route) {
                SettingsScreen()
            }
        }
    }
}
