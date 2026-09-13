package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.data.local.entity.PlanType
import com.example.presentation.ui.*
import com.example.presentation.viewmodel.MainViewModel
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                MaarifApp(viewModel)
            }
        }
    }
}

@Composable
fun MaarifApp(viewModel: MainViewModel) {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "dashboard") {
        composable("dashboard") {
            DashboardScreen(
                onNavigateToYearly = { navController.navigate("plans/YEARLY") },
                onNavigateToDaily = { navController.navigate("plans/DAILY") },
                onNavigateToSettings = { navController.navigate("settings") },
                onNavigateToLibrary = { navController.navigate("library") }
            )
        }
        composable("library") {
            LibraryScreen(
                viewModel = viewModel,
                onNavigateBack = { navController.popBackStack() }
            )
        }
        composable("settings") {
            SettingsScreen(
                viewModel = viewModel,
                onNavigateBack = { navController.popBackStack() }
            )
        }
        composable(
            "plans/{type}",
            arguments = listOf(navArgument("type") { type = NavType.StringType })
        ) { backStackEntry ->
            val typeStr = backStackEntry.arguments?.getString("type") ?: "YEARLY"
            val planType = PlanType.valueOf(typeStr)
            PlanScreen(
                viewModel = viewModel,
                planType = planType,
                onNavigateBack = { navController.popBackStack() },
                onNavigateToCreate = { navController.navigate("create_plan/$typeStr") },
                onNavigateToDetail = { id -> navController.navigate("plan_detail/$id") }
            )
        }
        composable(
            "create_plan/{type}",
            arguments = listOf(navArgument("type") { type = NavType.StringType })
        ) { backStackEntry ->
            val typeStr = backStackEntry.arguments?.getString("type") ?: "YEARLY"
            val planType = PlanType.valueOf(typeStr)
            CreatePlanScreen(
                viewModel = viewModel,
                planType = planType,
                onNavigateBack = { navController.popBackStack() }
            )
        }
        composable(
            "plan_detail/{id}",
            arguments = listOf(navArgument("id") { type = NavType.IntType })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getInt("id") ?: 0
            PlanDetailScreen(
                viewModel = viewModel,
                planId = id,
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}
