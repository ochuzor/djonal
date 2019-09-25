<template>
<!-- https://codepen.io/anon/pen/xGyMjM https://stackoverflow.com/a/31648405 -->
    <div class="wrapper">

        <div class="top-nav">
            Top nav
        </div>

      <div class="side-nav">
        <div v-for="i in 200" :key="i">
            title {{i}}
        </div>
      </div>

      <div class="content-wrapper">
        the other side
      </div>

    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
        background-color: #fff;
    }

    .top-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        width: 100%;
        background-color: green;
    }

    .side-nav {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        width: 250px;
        height: calc(100% - 60px);
        overflow-y: auto;
        background-color: red;
    }

    .content-wrapper {
        margin: 60px 0 0 250px;
        padding: 0 30px;
        overflow-y: auto;
        position: fixed;
        left: 0;
        top: 0;
        height: calc(100% - 60px);;
        width: 100%;
        background-color: blue;
    }
</style>>