package com.example.data.repository

import com.example.data.local.dao.AppDao
import com.example.data.local.entity.PlanEntity
import com.example.data.local.entity.SettingsEntity
import com.example.data.local.entity.TextbookEntity
import kotlinx.coroutines.flow.Flow

class AppRepository(private val dao: AppDao) {
    val settings: Flow<SettingsEntity?> = dao.getSettings()
    val textbooks: Flow<List<TextbookEntity>> = dao.getTextbooks()
    val yearlyPlans: Flow<List<PlanEntity>> = dao.getYearlyPlans()
    val dailyPlans: Flow<List<PlanEntity>> = dao.getDailyPlans()
    val libraryItems: Flow<List<com.example.data.local.entity.LibraryItemEntity>> = dao.getLibraryItems()

    suspend fun saveSettings(settings: SettingsEntity) = dao.saveSettings(settings)
    suspend fun insertTextbook(textbook: TextbookEntity) = dao.insertTextbook(textbook)
    suspend fun insertPlan(plan: PlanEntity) = dao.insertPlan(plan)
    suspend fun deletePlan(id: Int) = dao.deletePlan(id)
    suspend fun insertLibraryItem(item: com.example.data.local.entity.LibraryItemEntity) = dao.insertLibraryItem(item)
    suspend fun deleteLibraryItem(id: Int) = dao.deleteLibraryItem(id)
}
