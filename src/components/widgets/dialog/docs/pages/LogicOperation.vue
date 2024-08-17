<template>
  <h1 id="逻辑运算符与条件操作符">逻辑运算符与条件操作符</h1>
  <p>在前几节中，我们学习了 SpEL 的基本数据类型、算术运算符和比较运算符。本节将进一步探讨逻辑运算符、三元运算符（<code>? :</code>）、以及 Elvis 运算符（<code>?:</code>）的使用。这些运算符在构建复杂的逻辑判断和条件表达式时非常有用。</p>
  <h2 id="逻辑运算符">逻辑运算符</h2>
  <p>逻辑运算符用于在布尔表达式中进行逻辑运算。SpEL 支持以下逻辑运算符：</p>
  <ul>
    <li><strong>与 (<code>and</code> 或 <code>&amp;&amp;</code>)</strong>：当且仅当两个操作数都为 <code>true</code> 时，结果为 <code>true</code>。</li>
    <li><strong>或 (<code>or</code> 或 <code>||</code>)</strong>：当至少一个操作数为 <code>true</code> 时，结果为 <code>true</code>。</li>
    <li><strong>非 (<code>not</code> 或 <code>!</code>)</strong>：将布尔值取反。</li>
  </ul>
  <h3 id="示例">示例</h3>
  <pre class="kotlin"><code>true and false  // 结果为 false
true or false  // 结果为 true
not true  // 结果为 false</code></pre>
  <p>这些运算符可以使用符号形式（<code>&amp;&amp;</code>，<code>||</code>，<code>!</code>）或字母形式（<code>and</code>，<code>or</code>，<code>not</code>），它们的效果是一样的。</p>
  <h2 id="三元运算符">三元运算符</h2>
  <p>三元运算符 (<code>? :</code>) 是一种简洁的条件表达方式。它的结构如下：</p>
  <pre class="kotlin"><code>condition ? valueIfTrue : valueIfFalse</code></pre>
  <ul>
    <li><code>condition</code> 是一个布尔表达式。</li>
    <li>如果 <code>condition</code> 为 <code>true</code>，返回 <code>valueIfTrue</code>。</li>
    <li>如果 <code>condition</code> 为 <code>false</code>，返回 <code>valueIfFalse</code>。</li>
  </ul>
  <h3 id="示例-1">示例</h3>
  <pre class="kotlin"><code>10 &gt; 5 ? &#39;大于&#39; : &#39;小于&#39;  // 结果为 &#39;大于&#39;</code></pre>
  <p>在这个例子中，如果 <code>10 &gt; 5</code> 为真（<code>true</code>），则返回 <code>'大于'</code>，否则返回 <code>'小于'</code>。</p>
  <h2 id="elvis-运算符">Elvis 运算符</h2>
  <p>Elvis 运算符 (<code>?:</code>) 是三元运算符的简写形式，通常用于处理可能为 <code>null</code> 的值。它的语法如下：</p>
  <pre class="kotlin"><code>valueIfNotNull ?: defaultValue</code></pre>
  <ul>
    <li>如果 <code>valueIfNotNull</code> 不为 <code>null</code>，返回它；否则返回 <code>defaultValue</code>。</li>
  </ul>
  <h3 id="示例-2">示例</h3>
  <pre class="kotlin"><code>name ?: &#39;Unknown&#39;  // 如果 name 为 null，则返回 &#39;Unknown&#39;</code></pre>
  <p>这个运算符非常适合用于设置默认值，避免在值为 <code>null</code> 时引发异常。</p>
  <h2 id="安全导航运算符">安全导航运算符</h2>
  <p>安全导航运算符 (<code>?.</code>) 用于避免 <code>NullPointerException</code>。当对象可能为 <code>null</code> 时，使用 <code>?.</code> 可以确保如果对象为 <code>null</code>，表达式直接返回 <code>null</code> 而不会抛出异常。</p>
  <h3 id="示例-3">示例</h3>
  <pre class="kotlin"><code>person?.name  // 如果 person 为 null，返回 null</code></pre>
  <p>这个运算符常用于链式调用中，以确保在任何一步发生 <code>null</code> 时，不会导致整个表达式出错。</p>
  <h2 id="总结">总结</h2>
  <p>通过学习逻辑运算符、三元运算符和 Elvis 运算符，你现在能够更灵活地处理布尔逻辑和条件判断。这些运算符在构建动态表达式时至关重要，可以极大地简化代码并提高其可读性。</p>

</template>
<script setup lang="ts">
</script>