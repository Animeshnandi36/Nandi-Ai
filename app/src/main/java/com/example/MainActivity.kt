package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.example.ui.navigation.NandiNavHost
import com.example.ui.theme.CyberDarkBackground
import com.example.ui.theme.NandiAiTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            NandiAiTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = CyberDarkBackground
                ) {
                    val navController = rememberNavController()
                    NandiNavHost(navController = navController)
                }
            }
        }
    }
}

