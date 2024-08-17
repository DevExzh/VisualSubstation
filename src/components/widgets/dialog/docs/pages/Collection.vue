<template>
  <h1 id="集合操作">集合操作</h1>
  <p>在前几节中，我们探讨了如何在 SpEL 中调用方法和引用 Spring 的 Bean。本节将深入介绍 SpEL 中的集合操作，包括如何定义和操作列表、数组、以及字典（Map）。这些功能让你能够更灵活地处理和操作集合数据。</p>
  <h2 id="定义集合">定义集合</h2>
  <p>SpEL 支持在表达式中直接定义集合，包括列表、数组和字典（Map）。</p>
  <h3 id="列表">列表</h3>
  <p>列表（<code>List</code>）是一种有序的集合，可以包含多个元素。在 SpEL 中，列表可以使用 <code>{}</code> 语法定义：</p>
  <pre class="plaintext"><code>{element1, element2, element3}</code></pre>
  <h4 id="示例">示例</h4>
  <pre class="plaintext"><code>{&#39;Apple&#39;, &#39;Banana&#39;, &#39;Cherry&#39;}  // 定义一个包含三个水果名称的列表</code></pre>
  <p>在这个示例中，我们定义了一个包含三个字符串元素的列表。</p>
  <h3 id="数组">数组</h3>
  <p>数组是一种固定大小的集合，所有元素的类型必须相同。你可以通过 <code>new</code> 关键字创建数组，并使用嵌套的 <code>{}</code> 语法来初始化数组的元素。</p>
  <h4 id="示例-1">示例</h4>
  <pre class="plaintext"><code>new int[]{1, 2, 3, 4, 5}  // 创建一个包含五个整数的数组
new int[2][2] // 创建一个 2x2 的二维整数数组</code></pre>
  <p>在这些示例中，第一个表达式创建了一个包含五个整数的数组，第二个表达式创建了一个 2x2 的二维数组。</p>
  <h3 id="字典map">字典（Map）</h3>
  <p>字典（<code>Map</code>）是一种键值对集合，可以通过 <code>{key1:value1, key2:value2}</code> 语法来定义。</p>
  <h4 id="示例-2">示例</h4>
  <pre class="plaintext"><code>{&#39;name&#39;:&#39;John&#39;, &#39;age&#39;:30}  // 定义一个包含两个键值对的字典</code></pre>
  <p>在这个示例中，我们定义了一个包含 <code>name</code> 和 <code>age</code> 两个键值对的字典。</p>
  <h2 id="集合操作-1">集合操作</h2>
  <p>SpEL 提供了丰富的集合操作功能，允许你对列表、数组和字典进行访问和操作。</p>
  <h3 id="列表和数组的访问">列表和数组的访问</h3>
  <p>你可以使用索引来访问列表和数组中的元素。索引从 0 开始计数。</p>
  <h4 id="示例-3">示例</h4>
  <pre class="plaintext"><code>{&#39;Apple&#39;, &#39;Banana&#39;, &#39;Cherry&#39;}[1]  // 结果为 &#39;Banana&#39;
new int[]{10, 20, 30}[0]  // 结果为 10</code></pre>
  <p>在这些示例中，第一个表达式访问了列表中索引为 1 的元素 <code>'Banana'</code>，第二个表达式访问了数组中索引为 0 的元素 <code>10</code>。</p>
  <h3 id="字典的访问">字典的访问</h3>
  <p>你可以使用键来访问字典中的值。</p>
  <h4 id="示例-4">示例</h4>
  <pre class="plaintext"><code>{&#39;name&#39;:&#39;John&#39;, &#39;age&#39;:30}[&#39;name&#39;]  // 结果为 &#39;John&#39;</code></pre>
  <p>在这个示例中，表达式通过键 <code>'name'</code> 访问了字典中的值 <code>'John'</code>。</p>
  <h3 id="集合的投影">集合的投影</h3>
  <p>SpEL 支持集合投影操作，可以将集合中的每个元素映射为新的值，并返回一个新的集合。使用 <code>.![投影表达式]</code> 语法：</p>
  <h4 id="示例-5">示例</h4>
  <pre class="plaintext"><code>{&#39;Spring&#39;, &#39;Expression&#39;, &#39;Language&#39;}.![toUpperCase()]  // 结果为 {&#39;SPRING&#39;, &#39;EXPRESSION&#39;, &#39;LANGUAGE&#39;}</code></pre>
  <p>在这个示例中，表达式将每个字符串元素映射为大写形式，并返回一个包含大写字符串的新列表。</p>
  <h3 id="集合的选择">集合的选择</h3>
  <p>集合选择操作允许你从集合中筛选出符合条件的元素。使用 <code>.?[选择表达式]</code> 语法：</p>
  <h4 id="示例-6">示例</h4>
  <pre class="plaintext"><code>{&#39;Apple&#39;, &#39;Banana&#39;, &#39;Cherry&#39;}.?[length() &gt; 5]  // 结果为 {&#39;Banana&#39;, &#39;Cherry&#39;}</code></pre>
  <p>在这个示例中，表达式筛选出长度大于 5 的字符串元素，并返回一个新的列表。</p>
  <h2 id="总结">总结</h2>
  <p>通过学习如何在 SpEL 中定义和操作集合，你现在能够处理更复杂的数据结构，并在表达式中执行强大的集合操作。集合的定义、访问、投影和选择操作为表达式提供了极大的灵活性和功能。</p>
</template>