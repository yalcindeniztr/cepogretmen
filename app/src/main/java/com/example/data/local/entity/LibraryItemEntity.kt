package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "library")
data class LibraryItemEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val type: LibraryItemType, // YONETMELIK, MAARIF_MODELI, MATERYAL
    val content: String // URL or text content
)

enum class LibraryItemType {
    YONETMELIK, MAARIF_MODELI, MATERYAL
}
