package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.data.local.entity.PlanEntity
import com.example.data.local.entity.SettingsEntity
import com.example.data.local.entity.TextbookEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface AppDao {
    @Query("SELECT * FROM settings WHERE id = 1")
    fun getSettings(): Flow<SettingsEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveSettings(settings: SettingsEntity)

    @Query("SELECT * FROM textbooks ORDER BY gradeLevel ASC")
    fun getTextbooks(): Flow<List<TextbookEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTextbook(textbook: TextbookEntity)

    @Query("SELECT * FROM plans WHERE type = 'YEARLY' ORDER BY gradeLevel ASC, weekNumber ASC")
    fun getYearlyPlans(): Flow<List<PlanEntity>>

    @Query("SELECT * FROM plans WHERE type = 'DAILY' ORDER BY gradeLevel ASC, weekNumber ASC")
    fun getDailyPlans(): Flow<List<PlanEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPlan(plan: PlanEntity)
    
    @Query("DELETE FROM plans WHERE id = :id")
    suspend fun deletePlan(id: Int)
    
    @Query("SELECT * FROM library ORDER BY type ASC, title ASC")
    fun getLibraryItems(): Flow<List<com.example.data.local.entity.LibraryItemEntity>>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLibraryItem(item: com.example.data.local.entity.LibraryItemEntity)
    
    @Query("DELETE FROM library WHERE id = :id")
    suspend fun deleteLibraryItem(id: Int)
}
