package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.ShowChart
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.ChartDataItem
import com.example.data.model.ParsedChart
import com.example.ui.theme.CyberDarkCard
import com.example.ui.theme.CyberDarkSurfaceVariant
import com.example.ui.theme.CyberGold
import com.example.ui.theme.CyberGreen
import com.example.ui.theme.CyberPurple
import com.example.ui.theme.CyberRed
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.NeonCyanDark
import com.example.ui.theme.TextMutedDark
import com.example.ui.theme.TextPrimaryDark
import com.example.ui.theme.TextSecondaryDark

val chartColors = listOf(
    NeonCyan,
    CyberGold,
    CyberPurple,
    CyberGreen,
    Color(0xFFFF7A00),
    CyberRed,
    Color(0xFF00E5FF)
)

@Composable
fun DynamicChartView(
    chart: ParsedChart,
    modifier: Modifier = Modifier
) {
    var selectedItem by remember { mutableStateOf<ChartDataItem?>(null) }
    val progress = remember { Animatable(0f) }

    LaunchedEffect(chart) {
        progress.snapTo(0f)
        progress.animateTo(1f, animationSpec = tween(800))
    }

    Surface(
        shape = RoundedCornerShape(16.dp),
        color = CyberDarkCard,
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A)),
        modifier = modifier
            .fillMaxWidth()
            .testTag("dynamic_chart_card")
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = chart.title,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimaryDark
                    )
                    Text(
                        text = "${chart.xAxis} vs ${chart.yAxis}",
                        fontSize = 11.sp,
                        color = TextMutedDark
                    )
                }

                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = CyberDarkSurfaceVariant,
                    border = androidx.compose.foundation.BorderStroke(1.dp, NeonCyan.copy(alpha = 0.4f))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        val icon = when (chart.type.lowercase()) {
                            "pie" -> Icons.Default.PieChart
                            "line", "area" -> Icons.Default.ShowChart
                            else -> Icons.Default.BarChart
                        }
                        Icon(
                            imageVector = icon,
                            contentDescription = chart.type,
                            tint = NeonCyan,
                            modifier = Modifier.size(14.dp)
                        )
                        Text(
                            text = chart.type.uppercase(),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = NeonCyan
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Canvas Chart Area
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .background(Color(0xFF091222), RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                when (chart.type.lowercase()) {
                    "pie" -> PieChartCanvas(chart.items, progress.value) { selectedItem = it }
                    "line" -> LineChartCanvas(chart.items, progress.value, isArea = false) { selectedItem = it }
                    "area" -> LineChartCanvas(chart.items, progress.value, isArea = true) { selectedItem = it }
                    else -> BarChartCanvas(chart.items, progress.value) { selectedItem = it }
                }
            }

            // Selected Item Callout
            AnimatedVisibility(visible = selectedItem != null) {
                selectedItem?.let { item ->
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFF0E1A30),
                        border = androidx.compose.foundation.BorderStroke(1.dp, NeonCyan.copy(alpha = 0.5f)),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 10.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = item.label,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimaryDark
                            )
                            Text(
                                text = "Value: ${item.value}",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Black,
                                color = NeonCyan
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Legends
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                chart.items.take(4).forEachIndexed { index, item ->
                    val color = chartColors[index % chartColors.size]
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(color)
                        )
                        Text(
                            text = "${item.label}: ${item.value.toInt()}",
                            fontSize = 10.sp,
                            color = TextSecondaryDark
                        )
                    }
                }
            }

            if (chart.notes.isNotBlank()) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = chart.notes,
                    fontSize = 10.sp,
                    color = TextMutedDark
                )
            }
        }
    }
}

@Composable
fun BarChartCanvas(
    items: List<ChartDataItem>,
    animationProgress: Float,
    onSelect: (ChartDataItem) -> Unit
) {
    if (items.isEmpty()) return
    val maxValue = (items.maxOfOrNull { it.value } ?: 100f).coerceAtLeast(1f)

    Canvas(modifier = Modifier.fillMaxWidth().height(180.dp)) {
        val width = size.width
        val height = size.height
        val barCount = items.size
        val barSpacing = width / (barCount * 1.6f)
        val barWidth = barSpacing * 0.75f

        // Draw horizontal grid lines
        for (i in 1..3) {
            val y = height * (i / 4f)
            drawLine(
                color = Color(0x22FFFFFF),
                start = Offset(0f, y),
                end = Offset(width, y),
                strokeWidth = 1f
            )
        }

        items.forEachIndexed { index, item ->
            val color = chartColors[index % chartColors.size]
            val x = (index * barSpacing * 1.5f) + barSpacing * 0.5f
            val barHeight = (item.value / maxValue) * (height - 20f) * animationProgress
            val y = height - barHeight

            // Draw Bar
            drawRoundRect(
                brush = Brush.verticalGradient(
                    colors = listOf(color, color.copy(alpha = 0.4f)),
                    startY = y,
                    endY = height
                ),
                topLeft = Offset(x, y),
                size = Size(barWidth, barHeight),
                cornerRadius = CornerRadius(6f, 6f)
            )

            // Top highlight dot
            drawCircle(
                color = color,
                radius = 3f,
                center = Offset(x + barWidth / 2, y)
            )
        }
    }
}

@Composable
fun LineChartCanvas(
    items: List<ChartDataItem>,
    animationProgress: Float,
    isArea: Boolean,
    onSelect: (ChartDataItem) -> Unit
) {
    if (items.isEmpty()) return
    val maxValue = (items.maxOfOrNull { it.value } ?: 100f).coerceAtLeast(1f)

    Canvas(modifier = Modifier.fillMaxWidth().height(180.dp)) {
        val width = size.width
        val height = size.height
        val points = mutableListOf<Offset>()

        // Grid lines
        for (i in 1..3) {
            val y = height * (i / 4f)
            drawLine(
                color = Color(0x22FFFFFF),
                start = Offset(0f, y),
                end = Offset(width, y),
                strokeWidth = 1f
            )
        }

        val stepX = if (items.size > 1) width / (items.size - 1) else width / 2
        items.forEachIndexed { index, item ->
            val x = index * stepX
            val y = height - ((item.value / maxValue) * (height - 30f) * animationProgress) - 10f
            points.add(Offset(x, y))
        }

        // Draw Line Path
        if (points.isNotEmpty()) {
            val path = Path().apply {
                moveTo(points.first().x, points.first().y)
                for (i in 1 until points.size) {
                    val p0 = points[i - 1]
                    val p1 = points[i]
                    val controlX = (p0.x + p1.x) / 2
                    cubicTo(controlX, p0.y, controlX, p1.y, p1.x, p1.y)
                }
            }

            if (isArea) {
                val areaPath = Path().apply {
                    addPath(path)
                    lineTo(points.last().x, height)
                    lineTo(points.first().x, height)
                    close()
                }
                drawPath(
                    path = areaPath,
                    brush = Brush.verticalGradient(
                        colors = listOf(NeonCyan.copy(alpha = 0.45f), Color.Transparent),
                        startY = 0f,
                        endY = height
                    )
                )
            }

            drawPath(
                path = path,
                brush = Brush.horizontalGradient(listOf(NeonCyan, CyberGold, NeonCyan)),
                style = Stroke(width = 3.dp.toPx(), cap = StrokeCap.Round)
            )

            // Draw Points
            points.forEachIndexed { index, point ->
                drawCircle(
                    color = CyberGold,
                    radius = 4.dp.toPx(),
                    center = point
                )
                drawCircle(
                    color = Color(0xFF091222),
                    radius = 2.dp.toPx(),
                    center = point
                )
            }
        }
    }
}

@Composable
fun PieChartCanvas(
    items: List<ChartDataItem>,
    animationProgress: Float,
    onSelect: (ChartDataItem) -> Unit
) {
    if (items.isEmpty()) return
    val total = items.sumOf { it.value.toDouble() }.toFloat().coerceAtLeast(1f)

    Canvas(modifier = Modifier.fillMaxWidth().height(180.dp)) {
        val diameter = minOf(size.width, size.height) * 0.85f
        val center = Offset(size.width / 2, size.height / 2)
        val strokeWidth = 24.dp.toPx()
        val radius = (diameter - strokeWidth) / 2

        var startAngle = -90f
        items.forEachIndexed { index, item ->
            val sweepAngle = (item.value / total) * 360f * animationProgress
            val color = chartColors[index % chartColors.size]

            drawArc(
                color = color,
                startAngle = startAngle,
                sweepAngle = sweepAngle - 2f,
                useCenter = false,
                topLeft = Offset(center.x - radius, center.y - radius),
                size = Size(radius * 2, radius * 2),
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )

            startAngle += sweepAngle
        }

        // Inner glowing core
        drawCircle(
            color = Color(0xFF0F1E38),
            radius = radius - strokeWidth * 0.8f,
            center = center
        )
    }
}
