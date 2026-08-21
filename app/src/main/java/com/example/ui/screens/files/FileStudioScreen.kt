package com.example.ui.screens.files

import androidx.compose.animation.AnimatedVisibility
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Analytics
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.InsertDriveFile
import androidx.compose.material.icons.filled.TableChart
import androidx.compose.material.icons.filled.UploadFile
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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.repository.AiRepository
import com.example.ui.components.NandiFooter
import com.example.ui.components.NandiLogo
import com.example.ui.theme.CyberDarkCard
import com.example.ui.theme.CyberDarkSurfaceVariant
import com.example.ui.theme.CyberGold
import com.example.ui.theme.CyberGreen
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.TextMutedDark
import com.example.ui.theme.TextPrimaryDark
import com.example.ui.theme.TextSecondaryDark
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

data class SampleDoc(
    val title: String,
    val type: String,
    val size: String,
    val content: String,
    val summary: String,
    val keyPoints: List<String>
)

val sampleDocuments = listOf(
    SampleDoc(
        title = "2026_AI_Industry_Report.pdf",
        type = "PDF Document",
        size = "1.4 MB",
        content = "Executive Summary: In 2026, generative AI models like NandiAi and Gemini 3.5 have revolutionized enterprise computing. Key adoption indicators show a 142% surge in on-device neural inferencing...",
        summary = "Comprehensive market analysis showing hyper-growth in multimodal on-device AI adoption, reducing cloud latency by 68% and improving data privacy compliance across global enterprises.",
        keyPoints = listOf(
            "On-device inference adoption up 142% year-over-year.",
            "Sub-20ms latency enabled by localized neural processing units.",
            "Full-stack AI architectures like NandiAi becoming the industry standard."
        )
    ),
    SampleDoc(
        title = "cloud_infrastructure_metrics.csv",
        type = "CSV Dataset",
        size = "450 KB",
        content = "region,requests_per_sec,p99_latency_ms,error_rate\nus-east,14500,12.4,0.01\neu-west,9200,15.1,0.02\nap-south,18400,9.8,0.005",
        summary = "Live telemetric dataset covering 3 global edge regions. P99 latency across all regions averages 12.4ms with error rates remaining strictly below 0.02%.",
        keyPoints = listOf(
            "ap-south handles highest traffic volume at 18,400 req/s with lowest latency (9.8ms).",
            "Zero severe degradation incidents detected in the last 30 days."
        )
    ),
    SampleDoc(
        title = "nandi_engine_architecture.json",
        type = "JSON Schema",
        size = "82 KB",
        content = "{\n  \"engine\": \"NandiAi Core\",\n  \"version\": \"2026.1\",\n  \"developer\": \"Animesh Nandi\",\n  \"providers\": [\"gemini-3.5\", \"groq\", \"flux-1\"]\n}",
        summary = "System specification configuration declaring multi-provider fallback layers, Room local cache synchronization, and secure REST routing.",
        keyPoints = listOf(
            "Multi-provider failover guarantees 99.99% system availability.",
            "Zero client-side API key leakage by design."
        )
    )
)

@Composable
fun FileStudioScreen(
    modifier: Modifier = Modifier
) {
    var selectedDoc by remember { mutableStateOf(sampleDocuments[0]) }
    var queryText by remember { mutableStateOf("") }
    var isAnalyzing by remember { mutableStateOf(false) }
    var analysisResult by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()
    val aiRepository = remember { AiRepository() }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = 16.dp)
            .testTag("file_studio_screen"),
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
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFF7A00).copy(alpha = 0.5f))
                ) {
                    Text(
                        text = "Document Intelligence",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFFF7A00),
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
            }
        }

        // Title
        item {
            Column {
                Text(
                    text = "File & Doc Intelligence",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Text(
                    text = "Upload or select documents for deep semantic extraction and instant Q&A.",
                    fontSize = 13.sp,
                    color = TextSecondaryDark
                )
            }
        }

        // Document Selector Tabs
        item {
            Text(
                text = "ACTIVE DOCUMENTS",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                color = NeonCyan
            )
            Spacer(modifier = Modifier.height(6.dp))

            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(sampleDocuments) { doc ->
                    val isSelected = selectedDoc.title == doc.title
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = if (isSelected) Color(0xFF003852) else CyberDarkCard,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (isSelected) NeonCyan else Color(0xFF1E2D4A)
                        ),
                        modifier = Modifier.clickable {
                            selectedDoc = doc
                            analysisResult = null
                        }
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                imageVector = when (doc.type) {
                                    "CSV Dataset" -> Icons.Default.TableChart
                                    else -> Icons.Default.Description
                                },
                                contentDescription = null,
                                tint = if (isSelected) NeonCyan else TextMutedDark,
                                modifier = Modifier.size(20.dp)
                            )
                            Column {
                                Text(
                                    text = doc.title,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSelected) Color.White else TextPrimaryDark
                                )
                                Text(
                                    text = "${doc.type} · ${doc.size}",
                                    fontSize = 10.sp,
                                    color = TextMutedDark
                                )
                            }
                        }
                    }
                }
            }
        }

        // Active Document Summary Card
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = CyberDarkCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "EXECUTIVE SUMMARY",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.sp,
                            color = CyberGold
                        )
                        Icon(
                            imageVector = Icons.Default.Analytics,
                            contentDescription = null,
                            tint = CyberGold,
                            modifier = Modifier.size(16.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = selectedDoc.summary,
                        fontSize = 13.sp,
                        lineHeight = 19.sp,
                        color = TextPrimaryDark
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "KEY EXTRACTED INSIGHTS",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = CyberGreen
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    selectedDoc.keyPoints.forEach { point ->
                        Row(
                            modifier = Modifier.padding(vertical = 3.dp),
                            verticalAlignment = Alignment.Top,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = null,
                                tint = CyberGreen,
                                modifier = Modifier.size(14.dp)
                            )
                            Text(
                                text = point,
                                fontSize = 12.sp,
                                color = TextSecondaryDark
                            )
                        }
                    }
                }
            }
        }

        // Q&A on Document
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = CyberDarkCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "ASK QUESTIONS ABOUT THIS DOCUMENT",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = NeonCyan
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = queryText,
                        onValueChange = { queryText = it },
                        placeholder = {
                            Text(
                                "e.g. What is the average latency across regions?",
                                fontSize = 12.sp,
                                color = TextMutedDark
                            )
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("file_query_input"),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = NeonCyan,
                            unfocusedBorderColor = Color(0xFF1E2D4A),
                            focusedTextColor = TextPrimaryDark,
                            unfocusedTextColor = TextPrimaryDark
                        )
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Button(
                        onClick = {
                            if (queryText.isNotBlank()) {
                                scope.launch {
                                    isAnalyzing = true
                                    delay(600)
                                    val prompt = "Based on this document (${selectedDoc.title}): ${selectedDoc.content}\n\nAnswer this question: $queryText"
                                    val answer = aiRepository.generateChatResponse(listOf("user" to prompt))
                                    analysisResult = answer
                                    isAnalyzing = false
                                }
                            }
                        },
                        enabled = queryText.isNotBlank() && !isAnalyzing,
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = NeonCyan,
                            contentColor = Color(0xFF041E34)
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(44.dp)
                            .testTag("analyze_doc_btn")
                    ) {
                        if (isAnalyzing) {
                            CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color(0xFF041E34), strokeWidth = 2.dp)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Analyzing Semantic Vectors...", fontWeight = FontWeight.Bold)
                        } else {
                            Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Query Document", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Q&A Result
        analysisResult?.let { result ->
            item {
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Color(0xFF0C1B30),
                    border = androidx.compose.foundation.BorderStroke(1.dp, NeonCyan.copy(alpha = 0.5f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(
                            text = "NANDI INTEL ANSWER",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = NeonCyan
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = result,
                            fontSize = 13.sp,
                            lineHeight = 19.sp,
                            color = TextPrimaryDark
                        )
                    }
                }
            }
        }

        item {
            NandiFooter()
            Spacer(modifier = Modifier.height(64.dp))
        }
    }
}
