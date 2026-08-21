package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.MicOff
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.SmartToy
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.ui.theme.CyberDarkCard
import com.example.ui.theme.CyberDarkSurface
import com.example.ui.theme.CyberDarkSurfaceVariant
import com.example.ui.theme.CyberGold
import com.example.ui.theme.CyberGreen
import com.example.ui.theme.CyberPurple
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.NeonCyanDark
import com.example.ui.theme.TextMutedDark
import com.example.ui.theme.TextPrimaryDark
import com.example.ui.theme.TextSecondaryDark

@Composable
fun NandiLogo(
    modifier: Modifier = Modifier,
    size: Dp = 36.dp,
    showText: Boolean = true
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = modifier
    ) {
        Image(
            painter = painterResource(id = R.drawable.ic_nandi_ai_emblem),
            contentDescription = "NandiAi Official Logo Emblem",
            modifier = Modifier.size(size)
        )

        if (showText) {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "NANDI",
                        fontSize = (size.value * 0.42f).coerceAtLeast(14f).sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.width(3.dp))
                    Text(
                        text = "AI",
                        fontSize = (size.value * 0.42f).coerceAtLeast(14f).sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp,
                        color = NeonCyan
                    )
                }
                Text(
                    text = "BY ANIMESH NANDI",
                    fontSize = 8.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.5.sp,
                    color = CyberGold
                )
            }
        }
    }
}

@Composable
fun NandiTopAppBar(
    modifier: Modifier = Modifier,
    logoSize: Dp = 34.dp,
    showLogoText: Boolean = true,
    navigationIcon: (@Composable () -> Unit)? = null,
    actions: (@Composable RowScope.() -> Unit)? = null
) {
    Surface(
        color = CyberDarkSurface.copy(alpha = 0.95f),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A).copy(alpha = 0.7f)),
        shape = RoundedCornerShape(bottomStart = 14.dp, bottomEnd = 14.dp),
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 4.dp, vertical = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                navigationIcon?.invoke()
                NandiLogo(size = logoSize, showText = showLogoText)
            }

            if (actions != null) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    content = actions
                )
            }
        }
    }
}

@Composable
fun NandiLoadingIndicator(
    modifier: Modifier = Modifier,
    logoSize: Dp = 56.dp,
    statusText: String = "Synthesizing Neural Intelligence...",
    subText: String? = "Powered by Nandi AI Multi-Model Architecture"
) {
    val infiniteTransition = rememberInfiniteTransition(label = "nandi_pulse")
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000),
            repeatMode = RepeatMode.Reverse
        ),
        label = "logoPulse"
    )
    val ringRotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(3000, easing = androidx.compose.animation.core.LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "ringSpin"
    )

    Column(
        modifier = modifier.padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier.size(logoSize + 28.dp),
            contentAlignment = Alignment.Center
        ) {
            // Rotating Cyber Glow Aura Ring
            Canvas(modifier = Modifier.size(logoSize + 24.dp)) {
                drawCircle(
                    brush = Brush.sweepGradient(
                        listOf(
                            NeonCyan.copy(alpha = 0.1f),
                            NeonCyan.copy(alpha = 0.8f * pulseAlpha),
                            CyberGold.copy(alpha = 0.7f * pulseAlpha),
                            NeonCyan.copy(alpha = 0.1f)
                        )
                    ),
                    radius = (size.minDimension / 2f) * 0.95f,
                    style = androidx.compose.ui.graphics.drawscope.Stroke(width = 2.5.dp.toPx())
                )
            }

            // Official Emblem
            Image(
                painter = painterResource(id = R.drawable.ic_nandi_ai_emblem),
                contentDescription = "Nandi AI Official Emblem Loading",
                modifier = Modifier.size(logoSize)
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        Text(
            text = statusText,
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = NeonCyan,
            textAlign = TextAlign.Center
        )

        if (subText != null) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = subText,
                fontSize = 11.sp,
                color = TextSecondaryDark,
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
fun NandiLoadingCard(
    statusText: String,
    modifier: Modifier = Modifier,
    subText: String? = null
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = CyberDarkCard,
        border = androidx.compose.foundation.BorderStroke(1.dp, NeonCyan.copy(alpha = 0.4f)),
        modifier = modifier.fillMaxWidth()
    ) {
        NandiLoadingIndicator(
            statusText = statusText,
            subText = subText,
            logoSize = 48.dp,
            modifier = Modifier.fillMaxWidth().padding(12.dp)
        )
    }
}

@Composable
fun NandiLoadingScreen(
    statusText: String = "Initializing Nandi AI Neural Matrix...",
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentAlignment = Alignment.Center
    ) {
        NandiLoadingIndicator(
            logoSize = 72.dp,
            statusText = statusText,
            subText = "Official Nandi AI System Active"
        )
    }
}

@Composable
fun NandiFooter(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp, horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "© 2026 NandiAi · Developed by Animesh Nandi",
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium,
            color = TextMutedDark,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
fun StatusBadge(
    title: String,
    statusText: String,
    isActive: Boolean,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val alpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseAlpha"
    )

    Surface(
        shape = RoundedCornerShape(10.dp),
        color = CyberDarkSurfaceVariant.copy(alpha = 0.8f),
        border = androidx.compose.foundation.BorderStroke(1.dp, if (isActive) NeonCyan.copy(alpha = 0.3f) else Color.Gray.copy(alpha = 0.2f)),
        modifier = modifier
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(
                        if (isActive) CyberGreen.copy(alpha = alpha) else Color.Gray
                    )
            )
            Column {
                Text(
                    text = title,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimaryDark
                )
                Text(
                    text = statusText,
                    fontSize = 10.sp,
                    color = if (isActive) CyberGreen else TextMutedDark
                )
            }
        }
    }
}

@Composable
fun CodeHighlightBlock(
    code: String,
    language: String = "kotlin",
    modifier: Modifier = Modifier
) {
    val clipboardManager = LocalClipboardManager.current
    var copied by remember { mutableStateOf(false) }

    Surface(
        shape = RoundedCornerShape(12.dp),
        color = Color(0xFF070E1A),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2D4A)),
        modifier = modifier.fillMaxWidth()
    ) {
        Column {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF0F1A2E))
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(Color(0xFFFF5F56)))
                    Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(Color(0xFFFFBD2E)))
                    Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(Color(0xFF27C93F)))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = language.uppercase(),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace,
                        color = NeonCyan
                    )
                }

                IconButton(
                    onClick = {
                        clipboardManager.setText(AnnotatedString(code))
                        copied = true
                    },
                    modifier = Modifier.size(28.dp).testTag("copy_code_btn")
                ) {
                    Icon(
                        imageVector = if (copied) Icons.Default.Check else Icons.Default.ContentCopy,
                        contentDescription = "Copy Code",
                        tint = if (copied) CyberGreen else TextSecondaryDark,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }

            // Code lines
            Text(
                text = code,
                fontSize = 12.sp,
                fontFamily = FontFamily.Monospace,
                lineHeight = 18.sp,
                color = Color(0xFFE2E8F0),
                modifier = Modifier.padding(14.dp)
            )
        }
    }
}
