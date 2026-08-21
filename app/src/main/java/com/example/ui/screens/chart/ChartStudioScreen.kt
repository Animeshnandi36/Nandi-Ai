package com.example.ui.screens.chart

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.ShowChart
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.components.DynamicChartView
import com.example.ui.components.NandiFooter
import com.example.ui.components.NandiLoadingCard
import com.example.ui.components.NandiLogo
import com.example.ui.theme.CyberDarkCard
import com.example.ui.theme.CyberDarkSurfaceVariant
import com.example.ui.theme.CyberGold
import com.example.ui.theme.CyberPurple
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.TextMutedDark
import com.example.ui.theme.TextPrimaryDark
import com.example.ui.theme.TextSecondaryDark

val chartPresets = listOf(
    "AI Market Growth 2026",
    "Quarterly Cloud Revenue",
    "Global Mobile OS Share",
    "Server Latency Distribution",
    "Crypto Price Volatility"
)

@Composable
fun ChartStudioScreen(
    viewModel: ChartViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = 16.dp)
            .testTag("chart_studio_screen"),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                NandiLogo(size = 32.dp)
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = CyberDarkSurfaceVariant,
                    border = androidx.compose.foundation.BorderStroke(1.dp, CyberGold.copy(alpha = 0.5f))
                ) {
                    Text(
                        text = "Data Intelligence Engine",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyberGold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
            }
        }

        // Title
        item {
            Column {
                Text(
                    text = "AI Chart Studio",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Text(
                    text = "Transform data queries into interactive visual charts automatically.",
                    fontSize = 13.sp,
                    color = TextSecondaryDark
                )
            }
        }

        // Prompt Input Card
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = CyberDarkCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "DESCRIBE YOUR CHART",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = NeonCyan
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = uiState.prompt,
                        onValueChange = { viewModel.setPrompt(it) },
                        placeholder = {
                            Text(
                                "e.g. Compare Gemini 3.5, Claude 3.5, and Llama 3.3 benchmark scores...",
                                fontSize = 13.sp,
                                color = TextMutedDark
                            )
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("chart_prompt_input"),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = NeonCyan,
                            unfocusedBorderColor = Color(0xFF1E2D4A),
                            focusedTextColor = TextPrimaryDark,
                            unfocusedTextColor = TextPrimaryDark
                        )
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Preset Chips
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        items(chartPresets) { preset ->
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = CyberDarkSurfaceVariant,
                                modifier = Modifier.clickable {
                                    viewModel.setPrompt(preset)
                                    viewModel.generateChart(preset)
                                }
                            ) {
                                Text(
                                    text = preset,
                                    fontSize = 10.sp,
                                    color = TextSecondaryDark,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 5.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Button(
                        onClick = { viewModel.generateChart() },
                        enabled = uiState.prompt.isNotBlank() && !uiState.isGenerating,
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = CyberGold,
                            contentColor = Color(0xFF3F2E00)
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(46.dp)
                            .testTag("generate_chart_btn")
                    ) {
                        if (uiState.isGenerating) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(18.dp),
                                color = Color(0xFF3F2E00),
                                strokeWidth = 2.dp
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(text = "Synthesizing Dataset...", fontWeight = FontWeight.Bold)
                        } else {
                            Icon(
                                imageVector = Icons.Default.AutoAwesome,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(text = "Generate Visualization", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Generating Feedback Card
        if (uiState.isGenerating) {
            item {
                NandiLoadingCard(
                    statusText = "Synthesizing Dataset & Visual Schema...",
                    subText = "Nandi AI Data Intelligence Engine"
                )
            }
        }

        // Type Switcher Row (if chart loaded)
        uiState.currentChart?.let { chart ->
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val types = listOf(
                        "bar" to Icons.Default.BarChart,
                        "line" to Icons.Default.ShowChart,
                        "area" to Icons.Default.ShowChart,
                        "pie" to Icons.Default.PieChart
                    )
                    types.forEach { (type, icon) ->
                        val isSelected = chart.type.lowercase() == type
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = if (isSelected) NeonCyan.copy(alpha = 0.2f) else CyberDarkSurfaceVariant,
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (isSelected) NeonCyan else Color.Transparent
                            ),
                            modifier = Modifier
                                .weight(1f)
                                .clickable { viewModel.changeChartType(type) }
                        ) {
                            Row(
                                modifier = Modifier.padding(vertical = 8.dp, horizontal = 4.dp),
                                horizontalArrangement = Arrangement.Center,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = icon,
                                    contentDescription = type,
                                    tint = if (isSelected) NeonCyan else TextMutedDark,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = type.uppercase(),
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSelected) NeonCyan else TextMutedDark
                                )
                            }
                        }
                    }
                }
            }

            // Live Interactive Chart View
            item {
                DynamicChartView(chart = chart)
            }
        }

        item {
            NandiFooter()
            Spacer(modifier = Modifier.height(64.dp))
        }
    }
}
