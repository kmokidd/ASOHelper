<template>
  <aside>
    <section class="logo">
      <router-link to="/" class="link">
        <i class="icon icon-logo"></i>
      </router-link>
    </section>
    <nav>
      <router-link class="link" to="/">
        <i class="icon icon-analyze"></i>
        <p class="txt-nav">关键词分析</p>
      </router-link>
      <router-link class="link" to="/compete">
        <i class="icon icon-compete"></i>
        <p class="txt-nav">竞品分析</p>
      </router-link>
      <router-link class="link" to="/android">
        <i class="icon icon-android"></i>
        <p class="txt-nav">安卓填写</p>
      </router-link>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Nav'
}
</script>
