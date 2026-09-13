package com.example.presentation.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.local.entity.PlanEntity
import com.example.data.local.entity.PlanType
import com.example.presentation.components.EmbossedCard
import com.example.presentation.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlanScreen(
    viewModel: MainViewModel,
    planType: PlanType,
    onNavigateBack: () -> Unit,
    onNavigateToCreate: () -> Unit,
    onNavigateToDetail: (Int) -> Unit
) {
    val plans = if (planType == PlanType.YEARLY) {
        viewModel.yearlyPlans.collectAsStateWithLifecycle().value
    } else {
        viewModel.dailyPlans.collectAsStateWithLifecycle().value
    }
    
    val title = if (planType == PlanType.YEARLY) "Yıllık Planlar" else "Günlük Planlar"
    val color = if (planType == PlanType.YEARLY) Color(0xFF4CAF50) else Color(0xFF2196F3)

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(title) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Geri")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onNavigateToCreate, containerColor = color) {
                Icon(Icons.Default.Add, contentDescription = "Yeni Plan Ekle", tint = Color.White)
            }
        }
    ) { paddingValues ->
        if (plans.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize().padding(paddingValues), contentAlignment = androidx.compose.ui.Alignment.Center) {
                Text("Henüz plan bulunmuyor.", style = MaterialTheme.typography.bodyLarge)
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item { Spacer(modifier = Modifier.height(8.dp)) }
                items(plans.size) { index ->
                    val plan = plans[index]
                    EmbossedCard(
                        backgroundColor = color.copy(alpha = 0.1f),
                        onClick = { onNavigateToDetail(plan.id) },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column {
                            Text("${plan.gradeLevel}. Sınıf - ${plan.title}", style = MaterialTheme.typography.titleMedium)
                            Text("Hafta: ${plan.weekNumber} | ${plan.dateRange}", style = MaterialTheme.typography.bodyMedium)
                        }
                    }
                }
                item { Spacer(modifier = Modifier.height(16.dp)) }
            }
        }
    }
}
