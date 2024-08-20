<template>
  <table class="table">
    <caption class="caption">常用电压等级带电作业的各种安全距离</caption>
    <tr class="row row-head">
      <th class="col-head" colspan="2">电压等级 (kV)</th>
      <th>10</th>
      <th>35</th>
      <th>63 (66)</th>
      <th>110</th>
      <th>220</th>
      <th>330</th>
      <th>500</th>
    </tr>
    <tr class="row">
      <td class="col-head" colspan="2">人体对带电体<br>最小安全距离 (m)</td>
      <td>0.4</td>
      <td>0.6</td>
      <td>0.7</td>
      <td>1.0</td>
      <td>1.8</td>
      <td>2.6</td>
      <td>3.2<sup class="asterisk">*</sup></td>
    </tr>
    <tr class="row">
      <td class="col-head" colspan="2">等电位作业时<br>人体对地安全距离 (m)</td>
      <td>0.4</td>
      <td>0.6</td>
      <td>0.7</td>
      <td>1.0</td>
      <td>1.8</td>
      <td>2.6</td>
      <td>3.2<sup class="asterisk">*</sup></td>
    </tr>
    <tr class="row">
      <td class="col-head" colspan="2">最小相间<br>安全距离(m)</td>
      <td>0.6</td>
      <td>0.8</td>
      <td>0.9</td>
      <td>1.4</td>
      <td>2.5</td>
      <td>3.5</td>
      <td>5.0</td>
    </tr>
    <tr class="row">
      <td class="col-head" colspan="2">最小组合<br>间隙(m)</td>
      <td>—</td>
      <td>0.7</td>
      <td>0.8</td>
      <td>1.2</td>
      <td>2.1</td>
      <td>3.1</td>
      <td>4.0</td>
    </tr>
    <tr class="row">
      <td class="col-head" rowspan="2">最短绝缘<br>有效长度(m)</td>
      <td>操作杆</td>
      <td>0.7</td>
      <td>0.9</td>
      <td>1.0</td>
      <td>1.3</td>
      <td>2.1</td>
      <td>3.1</td>
      <td>4.0</td>
    </tr>
    <tr class="row">
      <td>承力杆、绝缘绳</td>
      <td>0.4</td>
      <td>0.6</td>
      <td>0.7</td>
      <td>1.0</td>
      <td>1.8</td>
      <td>2.8</td>
      <td>3.7</td>
    </tr>
  </table>
  <div class="footnote">
    <sup class="asterisk">*</sup>&ensp;海拔高度在 500m 以下，取 3.2m 值；海拔高度在 500~1000m 时，取 3.4m 值。
  </div>
</template>

<style lang="scss" scoped>
.table {
  width: 100%;
  color: rgba(0, 0, 0, 0.5);
  border-collapse: collapse;
  border-spacing: 0;
  height: fit-content;
  table-layout: fixed;
  font-size: 0.75em;
  .caption {
    font-weight: bolder;
    font-size: medium;
    padding-bottom: 0.4em;
    &::after {
      content: '基于国家标准 GB/T 19185-2008 计算得到';
      display: block;
      font-size: 0.72em;
      font-weight: normal;
    }
  }
  .row {
    &:nth-child(odd) {
      background-color: rgba(100%, 100%, 100%, 0.2);
    }
    &:nth-child(even) {
      background-color: rgba(50%, 50%, 50%, 0.2);
    }
    > * {
      padding: 0.2rem;
      border: 1pt solid rgba(50%, 50%, 50%, 0.5);
    }
    .col-head {
      font-weight: bold;
    }
  }
}
.asterisk {
  color: rgba(244, 67, 54, 0.8);
  font-weight: bold;
}
.footnote {
  color: rgba(0, 0, 0, 0.5);
  width: 100%;
  text-align: left;
  font-size: small;
}
</style>