package com.example.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun EmbossedCard(
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    backgroundColor: Color = MaterialTheme.colorScheme.surfaceVariant,
    content: @Composable () -> Unit
) {
    val shape = RoundedCornerShape(16.dp)
    var boxModifier = modifier
        .shadow(
            elevation = 8.dp,
            shape = shape,
            spotColor = Color.Black.copy(alpha = 0.2f),
            ambientColor = Color.Black.copy(alpha = 0.2f)
        )
        .background(color = backgroundColor, shape = shape)
        .border(
            width = 1.dp,
            color = Color.White.copy(alpha = 0.5f), // subtle highlight for 3D effect
            shape = shape
        )
        
    if (onClick != null) {
        boxModifier = boxModifier.clickable { onClick() }
    }

    Box(
        modifier = boxModifier.padding(16.dp)
    ) {
        content()
    }
}
