<template>
    <h1 id="基本数据类型与算术操作">基本数据类型与算术操作</h1>
    <h2 id="基本数据类型">基本数据类型</h2>
    <p>在开始学习 SpEL（Spring 表达式语言）之前，我们需要理解一些最基础的概念：数据类型。SpEL 支持四种主要的数据类型：字符串、数字、布尔值和 <code>null</code>。这些数据类型构成了表达式的基本组成部分。</p>
    <h3 id="字符串-string">字符串 (String)</h3>
    <p>字符串是一串字符的序列，用于表示文本信息。在 SpEL 中，字符串必须用单引号 <code>' '</code> 括起来。例如：</p>
    <pre class="kotlin"><code>&#39;Hello World&#39;</code></pre>
    <p>这个表达式代表了一个包含 “Hello World” 的字符串。在 SpEL 中，字符串可以包含字母、数字、符号或空格等任何字符。</p>
    <h3 id="数字-number">数字 (Number)</h3>
    <p>数字是最基本的数据类型之一，代表了整数或小数。在 SpEL 中，数字可以是整数或浮点数，支持正数、负数以及科学计数法。</p>
    <ul>
        <li><strong>整数</strong>：如 <code>42</code>, <code>-5</code></li>
        <li><strong>浮点数</strong>：如 <code>3.14</code>, <code>-0.001</code>, <code>1.23E+3</code> (表示 1230)</li>
    </ul>
    <h3 id="布尔值-boolean">布尔值 (Boolean)</h3>
    <p>布尔值只有两个可能的值：<code>true</code> 或 <code>false</code>。它们常用于条件判断和逻辑表达式中。例如：</p>
    <pre class="kotlin"><code>true
false</code></pre>
    <p>布尔值通常用于表示一个表达式的结果是 “真” 还是 “假”。</p>
    <h3 id="空值-null">空值 (Null)</h3>
    <p><code>null</code> 是一个特殊的值，用于表示一个没有值的状态。在 SpEL 中，<code>null</code> 可以用于表示未初始化的变量或缺少值的对象。例如：</p>
    <pre class="kotlin"><code>null</code></pre>
    <p>在代码中，<code>null</code> 通常用于检查某个对象是否为空或未赋值。</p>
    <h2 id="算术运算符">算术运算符</h2>
    <p>在理解了基本数据类型之后，接下来介绍如何使用 SpEL 进行算术运算。算术运算符用于对数字进行计算。SpEL 支持以下基本的算术运算符：</p>
    <ul>
        <li><strong>加法 (<code>+</code>)</strong>：用于两个数值的相加。</li>
        <li><strong>减法 (<code>-</code>)</strong>：用于从一个数值中减去另一个数值。</li>
        <li><strong>乘法 (<code>*</code>)</strong>：用于两个数值的相乘。</li>
        <li><strong>除法 (<code>/</code>)</strong>：用于将一个数值除以另一个数值。</li>
        <li><strong>取模 (<code>%</code>)</strong>：用于计算两个数值相除后的余数。</li>
        <li><strong>幂运算 (<code>^</code>)</strong>：用于计算一个数值的幂。</li>
    </ul>
    <h3 id="加法">加法 (<code>+</code>)</h3>
    <p>加法运算符用于将两个数值相加。例如：</p>
    <pre class="kotlin"><code>5 + 3  // 结果为 8</code></pre>
    <h3 id="减法--">减法 (<code>-</code>)</h3>
    <p>减法运算符用于从第一个数值中减去第二个数值。例如：</p>
    <pre class="kotlin"><code>10 - 4  // 结果为 6</code></pre>
    <h3 id="乘法">乘法 (<code>*</code>)</h3>
    <p>乘法运算符用于两个数值相乘。例如：</p>
    <pre class="kotlin"><code>6 * 7  // 结果为 42</code></pre>
    <h3 id="除法">除法 (<code>/</code>)</h3>
    <p>除法运算符用于将一个数值除以另一个数值。例如：</p>
    <pre class="kotlin"><code>20 / 4  // 结果为 5</code></pre>
    <h3 id="取模">取模 (<code>%</code>)</h3>
    <p>取模运算符用于计算除法后的余数。例如：</p>
    <pre class="kotlin"><code>10 % 3  // 结果为 1</code></pre>
    <h3 id="幂运算">幂运算 (<code>^</code>)</h3>
    <p>幂运算符用于计算一个数值的幂次方。例如：</p>
    <pre class="kotlin"><code>2 ^ 3  // 结果为 8（即 2 的 3 次方）</code></pre>
    <h2 id="算术运算的示例">算术运算的示例</h2>
    <pre class="kotlin"><code>3 + 5 * 2  // 结果为 13，因为乘法的优先级高于加法
(3 + 5) * 2  // 结果为 16，因为括号改变了运算的优先级</code></pre>
    <p>在以上示例中，SpEL 的运算符优先级与我们在数学中的规则是一致的：乘法和除法比加法和减法优先执行。如果需要改变运算顺序，可以使用括号。</p>
    <h2 id="总结">总结</h2>
    <p>在本节中，我们介绍了 SpEL 中的四种基本数据类型（字符串、数字、布尔值和 <code>null</code>），以及它们在表达式中的用法。然后，我们学习了如何使用 SpEL 的算术运算符进行基本的数学运算。理解这些基本概念和操作将为你后续学习更复杂的 SpEL 表达式打下坚实的基础。</p>
</template>