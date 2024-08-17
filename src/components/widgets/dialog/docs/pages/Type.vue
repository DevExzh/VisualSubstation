<template>
  <h1 id="类型操作与实例化对象">类型操作与实例化对象</h1>
  <p>在前几节中，我们探讨了 SpEL 的基本数据类型、运算符、以及字符串操作和正则表达式。本节将深入介绍 SpEL 中的类型操作，如何在表达式中引用类型、实例化对象以及进行类型检查。</p>
  <h2 id="类型引用">类型引用</h2>
  <p>在 SpEL 中，你可以通过 <code>T()</code> 操作符来引用 Java 类。这种引用允许你访问该类的静态字段和方法，也可以用于在表达式中进行类型检查。引用类型的语法如下：</p>
  <pre class="plaintext"><code>T(ClassName)</code></pre>
  <h3 id="示例">示例</h3>
  <pre class="plaintext"><code>T(java.lang.Math).PI  // 引用 Math 类中的静态常量 PI
T(java.lang.Math).abs(-10)  // 调用 Math 类的静态方法 abs()</code></pre>
  <p>在这些示例中，<code>T(java.lang.Math)</code> 引用了 <code>Math</code> 类，这样你就可以访问它的静态字段和方法。需要注意的是，位于 <code>java.lang</code> 包中的类，如 <code>Math</code>，可以直接引用而无需指定包名。</p>
  <h2 id="实例化对象">实例化对象</h2>
  <p>SpEL 允许你在表达式中实例化 Java 对象。实例化对象使用 <code>new</code> 关键字，语法格式如下：</p>
  <pre class="plaintext"><code>new ClassName(arguments)</code></pre>
  <h3 id="示例-1">示例</h3>
  <pre class="plaintext"><code>new java.util.Date()  // 创建一个新的 Date 对象
new String(&#39;Hello, World!&#39;)  // 创建一个新的 String 对象</code></pre>
  <p>这个特性使得你可以在表达式中动态地创建对象，并在需要时使用它们。</p>
  <h2 id="类型检查-instanceof">类型检查 (<code>instanceof</code>)</h2>
  <p>SpEL 提供了 <code>instanceof</code> 操作符，用于检查一个对象是否为指定类型的实例。这对于控制逻辑流或根据对象类型执行不同的操作非常有用。语法如下：</p>
  <pre class="plaintext"><code>object instanceof T(ClassName)</code></pre>
  <h3 id="示例-2">示例</h3>
  <pre class="plaintext"><code>#myVar instanceof T(String)  // 检查 #myVar 是否为 String 类型</code></pre>
  <p>在这个示例中，如果 <code>#myVar</code> 是 <code>String</code> 类型，表达式将返回 <code>true</code>，否则返回 <code>false</code>。</p>
  <h2 id="结合示例">结合示例</h2>
  <p>下面是一个结合类型引用、对象实例化和类型检查的综合示例：</p>
  <pre class="plaintext"><code>T(java.lang.Math).sqrt(16)  // 结果为 4.0
new java.util.ArrayList()  // 创建一个新的 ArrayList 对象
#myList = new java.util.ArrayList(); #myList instanceof T(java.util.List)  // 结果为 true</code></pre>
  <p>在这个示例中，我们首先计算了 16 的平方根，接着创建了一个新的 <code>ArrayList</code> 对象，并检查该对象是否为 <code>List</code> 类型。</p>
  <h2 id="总结">总结</h2>
  <p>通过学习 SpEL 的类型操作与对象实例化，你现在能够在表达式中引用 Java 类型、创建对象并进行类型检查。这些操作极大地增强了 SpEL 的灵活性，使其不仅限于简单的表达式处理，还能够处理更复杂的对象操作。</p>

</template>
<script setup lang="ts">
</script>