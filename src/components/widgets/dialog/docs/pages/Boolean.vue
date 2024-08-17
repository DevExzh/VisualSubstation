<template>
  <h1 id="布尔运算符与比较运算符">布尔运算符与比较运算符</h1>
  <p>在上一节中，我们学习了 SpEL 中的基本数据类型和算术运算符。本节将深入探讨布尔运算符和比较运算符的使用。这些运算符用于逻辑判断和条件表达，是编写复杂表达式的重要工具。</p>
  <h2 id="布尔运算符">布尔运算符</h2>
  <p>布尔运算符用于处理布尔值（<code>true</code> 或 <code>false</code>），这些运算符是逻辑表达式的核心。SpEL 支持以下常见的布尔运算符：</p>
  <ul>
    <li><strong>相等 (<code>==</code>)</strong>：判断两个值是否相等。</li>
    <li><strong>不相等 (<code>!=</code>)</strong>：判断两个值是否不相等。</li>
    <li><strong>大于 (<code>&gt;</code>)</strong>：判断左边的值是否大于右边的值。</li>
    <li><strong>大于或等于 (<code>&gt;=</code>)</strong>：判断左边的值是否大于或等于右边的值。</li>
    <li><strong>小于 (<code>&lt;</code>)</strong>：判断左边的值是否小于右边的值。</li>
    <li><strong>小于或等于 (<code>&lt;=</code>)</strong>：判断左边的值是否小于或等于右边的值。</li>
  </ul>
  <h3 id="相等">相等 (<code>==</code>)</h3>
  <p>相等运算符用于判断两个值是否相等，返回 <code>true</code> 或 <code>false</code>。</p>
  <pre class="kotlin"><code>5 == 5  // 结果为 true
&#39;hello&#39; == &#39;hello&#39;  // 结果为 true
5 == 10  // 结果为 false</code></pre>
  <h3 id="不相等">不相等 (<code>!=</code>)</h3>
  <p>不相等运算符用于判断两个值是否不相等，返回 <code>true</code> 或 <code>false</code>。</p>
  <pre class="kotlin"><code>5 != 10  // 结果为 true
&#39;hello&#39; != &#39;world&#39;  // 结果为 true
5 != 5  // 结果为 false</code></pre>
  <h3 id="大于">大于 (<code>&gt;</code>)</h3>
  <p>大于运算符用于判断左边的值是否大于右边的值，返回 <code>true</code> 或 <code>false</code>。</p>
  <pre class="kotlin"><code>10 &gt; 5  // 结果为 true
5 &gt; 10  // 结果为 false</code></pre>
  <h3 id="大于或等于">大于或等于 (<code>&gt;=</code>)</h3>
  <p>大于或等于运算符用于判断左边的值是否大于或等于右边的值，返回 <code>true</code> 或 <code>false</code>。</p>
  <pre class="kotlin"><code>10 &gt;= 5  // 结果为 true
5 &gt;= 5  // 结果为 true
4 &gt;= 5  // 结果为 false</code></pre>
  <h3 id="小于">小于 (<code>&lt;</code>)</h3>
  <p>小于运算符用于判断左边的值是否小于右边的值，返回 <code>true</code> 或 <code>false</code>。</p>
  <pre class="kotlin"><code>5 &lt; 10  // 结果为 true
10 &lt; 5  // 结果为 false</code></pre>
  <h3 id="小于或等于">小于或等于 (<code>&lt;=</code>)</h3>
  <p>小于或等于运算符用于判断左边的值是否小于或等于右边的值，返回 <code>true</code> 或 <code>false</code>。</p>
  <pre class="kotlin"><code>5 &lt;= 10  // 结果为 true
5 &lt;= 5  // 结果为 true
10 &lt;= 5  // 结果为 false</code></pre>
  <h2 id="比较运算符的别名">比较运算符的别名</h2>
  <p>SpEL 还提供了一组比较运算符的别名，这些别名可以替代上述符号运算符，尤其在 XML 配置中，使用这些别名更为方便，因为 XML 不允许直接使用某些符号。例如：</p>
  <ul>
    <li><strong>相等 (<code>eq</code>)</strong> 相当于 <code>==</code></li>
    <li><strong>不相等 (<code>ne</code>)</strong> 相当于 <code>!=</code></li>
    <li><strong>大于 (<code>gt</code>)</strong> 相当于 <code>&gt;</code></li>
    <li><strong>大于或等于 (<code>ge</code>)</strong> 相当于 <code>&gt;=</code></li>
    <li><strong>小于 (<code>lt</code>)</strong> 相当于 <code>&lt;</code></li>
    <li><strong>小于或等于 (<code>le</code>)</strong> 相当于 <code>&lt;=</code></li>
  </ul>
  <h3 id="示例">示例</h3>
  <pre class="kotlin"><code>5 eq 5  // 结果为 true
10 ne 5  // 结果为 true
10 gt 5  // 结果为 true
5 le 5  // 结果为 true</code></pre>
  <h2 id="区间判断-between">区间判断 (<code>between</code>)</h2>
  <p><code>between</code> 运算符用于判断一个数值是否在指定的区间内，包括区间的边界。例如：</p>
  <pre class="kotlin"><code>5 between 1 and 10  // 结果为 true，因为 5 在 1 到 10 的区间内</code></pre>
  <p><code>between</code> 语法与自然语言非常接近，适合用于描述范围判断。</p>
  <h2 id="总结">总结</h2>
  <p>在本节中，我们详细介绍了 SpEL 中的布尔运算符和比较运算符。这些运算符是表达式中进行逻辑判断和条件控制的基础。通过理解和掌握这些运算符，你可以编写更为复杂和精确的逻辑表达式。</p>
</template>
<script setup lang="ts">
</script>