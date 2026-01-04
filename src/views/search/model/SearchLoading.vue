<template>
    <div class="flex flex-col justify-center items-center py-32">
        <div class="loading-dots">
            <span></span><span></span><span></span><span></span>
        </div>
        <p class="mt-6 text-gray-400 font-medium animate-pulse">
            正在为您筛选优质商品...
        </p>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
    /* 加载动画 */
    .loading-dots {
        display: flex;
        gap: 8px;
    }
    .loading-dots span {
        width: 12px;
        height: 12px;
        background-color: #f97316;
        border-radius: 50%;
        animation: bounce 0.5s infinite alternate;
    }
    .loading-dots span:nth-child(2) {
        animation-delay: 0.1s;
    }
    .loading-dots span:nth-child(3) {
        animation-delay: 0.2s;
    }
    .loading-dots span:nth-child(4) {
        animation-delay: 0.3s;
    }

    @keyframes bounce {
        to {
            transform: translateY(-10px);
            opacity: 0.5;
        }
    }
</style>