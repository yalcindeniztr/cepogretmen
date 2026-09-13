package com.example.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.example.data.local.dao.AppDao
import com.example.data.local.entity.LibraryItemEntity
import com.example.data.local.entity.PlanEntity
import com.example.data.local.entity.SettingsEntity
import com.example.data.local.entity.TextbookEntity

@Database(entities = [SettingsEntity::class, TextbookEntity::class, PlanEntity::class, LibraryItemEntity::class], version = 2, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun appDao(): AppDao
}
