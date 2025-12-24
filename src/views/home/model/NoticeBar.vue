<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchNotice, type NoticeItem } from '@/api/home'
import { Bell } from '@element-plus/icons-vue'

const noticeList = ref<NoticeItem[]>([])

const getNoticeList = async () => {
  try {
    const res = await fetchNotice()
    noticeList.value = res.data || []
  } catch (error) {
    console.error('获取公告失败:', error)
  }
}

onMounted(() => {
  getNoticeList()
})
</script>

<template>
  <div v-if="noticeList.length > 0" class="notice-bar-container">
    <div class="notice-bar-content">
      <el-icon class="notice-icon"><Bell /></el-icon>
      <div class="notice-carousel-wrapper">
        <el-carousel
          height="40px"
          direction="vertical"
          :autoplay="true"
          :interval="3000"
          indicator-position="none"
          arrow="never"
        >
          <el-carousel-item v-for="item in noticeList" :key="item.id">
            <div class="notice-item text-truncate" :title="item.content">
              <span class="notice-text">{{ item.content }}</span>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.notice-bar-container {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 4px;
  margin: 10px 0;
  padding: 0 15px;
}

.notice-bar-content {
  display: flex;
  align-items: center;
  height: 40px;
}

.notice-icon {
  color: #faad14;
  font-size: 18px;
  margin-right: 10px;
}

.notice-carousel-wrapper {
  flex: 1;
  overflow: hidden;
}

.notice-item {
  line-height: 40px;
  font-size: 14px;
  color: #5c5c5c;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>