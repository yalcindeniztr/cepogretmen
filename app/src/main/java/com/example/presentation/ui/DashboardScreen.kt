package com.example.presentation.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.presentation.components.EmbossedCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    onNavigateToYearly: () -> Unit,
    onNavigateToDaily: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onNavigateToLibrary: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Maarif Planlayıcı", fontWeight = FontWeight.Bold) },
                actions = {
                    IconButton(onClick = onNavigateToSettings) {
                        Icon(Icons.Default.Settings, contentDescription = "Ayarlar")
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                "Türkiye Yüzyılı Maarif Modeli\nTarih Dersi Planlama Uygulaması",
                style = MaterialTheme.typography.titleMedium,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(bottom = 32.dp)
            )

            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                item {
                    EmbossedCard(
                        backgroundColor = Color(0xFF4CAF50).copy(alpha = 0.8f),
                        onClick = onNavigateToYearly,
                        modifier = Modifier.aspectRatio(1f)
                    ) {
                        Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                            Text("Yıllık Planlar", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                item {
                    EmbossedCard(
                        backgroundColor = Color(0xFF2196F3).copy(alpha = 0.8f),
                        onClick = onNavigateToDaily,
                        modifier = Modifier.aspectRatio(1f)
                    ) {
                        Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                            Text("Günlük Planlar", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                item {
                    EmbossedCard(
                        backgroundColor = Color(0xFFFF9800).copy(alpha = 0.8f),
                        onClick = onNavigateToSettings,
                        modifier = Modifier.aspectRatio(1f)
                    ) {
                        Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                            Text("Öğretmen / Okul\nAyarları", color = Color.White, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
                        }
                    }
                }
                item {
                    EmbossedCard(
                        backgroundColor = Color(0xFF9C27B0).copy(alpha = 0.8f),
                        onClick = onNavigateToLibrary,
                        modifier = Modifier.aspectRatio(1f)
                    ) {
                        Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                            Text("Ders Materyalleri\n(Kütüphane)", color = Color.White, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
                        }
                    }
                }
            }
        }
    }
}
