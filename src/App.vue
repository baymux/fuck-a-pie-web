<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
// eslint-disable-next-line
  const { locales } = antd;
export default {
  name: 'App',
  data () {
    return {
      locale: locales.zh_CN
    }
  }
}
</script>

<style>
  #app {
    width:100%;
    height: 100%;
    font-family: Source Han Sans CN, Source Han Sans CN-Bold;
  }
  html,body{
    width:100%;
    height: 100%;
    max-width: 1920px;
    max-height: 1080px;
    color: #000000;
    font-size: 14px;
  }
  *{
    margin: 0;
    padding:0;
  }
  i{
    font-style: normal;
  }
  @media only screen and (max-width: 1200px) {
    html {
      height: 969px;
      width: 1920px;
      overflow: auto;
    }
  }
  .ant-modal-header {
    color: #ffffff;
    background: #109CF1;
    border-bottom: 1px solid #109CF1;
  }
  .ant-modal-title {
    color: #ffffff;
  }
  .ant-modal-close {
    color: #fff;
  }
  .ant-modal-close:focus,
  .ant-modal-close:hover {
    color: #ffffff;
  }
  .ant-table-body {
    box-shadow: 0px 6px 18px 0px rgba(0,0,0,0.06);
  }
  .ant-table-thead > tr > th {
    color: #ffffff;
    font-weight: 500;
    text-align: center;
    background: #109CF1;
    border-bottom: 1px solid #109CF1;
  }
  .ant-table-tbody > tr > td {
    color: #323C47;
    font-weight: 500;
    text-align: center;
    background: transparent;
    border-bottom: 1px solid #F1F1F1;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 12px 16px;
    overflow-wrap: break-word;
  }
  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
  .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
  .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background: rgba(242,242,242,1);
  }
  .ant-btn{
    background: #ffffff;
    border-radius: 6px;
    box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.14);
    border: 1px solid #ffffff;
    color: #109CF1;
  }
</style>
