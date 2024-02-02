---
layout : post
title : Python For C++ Developers
tags : [Python]
category : Python
---
* auto-gen TOC:
{:toc}

Tips for C++ developers jump to use Python.

<!--more-->

## Check is something empty

it is recommended to use 

```
if items:
  do some thing
```

other than 

```
if len(items) != 0: 
  do some thing
if items != None: 
  do some thing
```

## Don't forget `:` at the end

Python uses `:` to indicate a block of code. Although I think it is not necessary, but it is.

```
if some_condition:
  do something
while some_condition:
  do something
```

## Use `pass` if nothing to do in a branch

```
if some_condition:
  pass
else:
  do something
```

## NULL/true/false

Use 'None/True/False' instead.

## Logic operators

Use `and, or, not` for `&& || !` respectively 

```
if not some_condition:
  pass
if some_condition and another_condtion:
  pass
```


## Indention

Indention in python is non-trivial and compulsory. Code-block is defined by indention like `{` and `}` in C++

```
if some_condition:
  do something
  do another thing # OK, indention is consistent with the previous statement
else:
  do something else
    do another thing # Fails since the indention is inconsistent
```

Be caution with tab and space. It is recommended to config your editor display white-chars and replace tab with spaces.


## for each

```
for item in item_list:
  print item
```

## Enumerate items in a container

```
for (index, item) in enumerate(items): 
  print index, item

for (key,value) in mydict.items():
  print key,value
```

## string

```
'this is a string'
"this is also a string"
'''this is a 
multi-line string'''
```

## Join strings

```
colors = ['red', 'blue', 'green', 'yellow'] 
result = '|'.join(colors)
print result #It will print 'red|blue|green|yellow' 
```

## Swap two variables

```
a,b = b,a
```

## list, set, tuple, dict

```
list -> array/vector: ['this','is','a','list']
set -> std::set
tuple -> const list: ('this','is','a','list')
dict -> hash map: {"key1":"value1", "key2":"value2"}
```

list to set: aNewSet = set(mylist), with duplicated item automatically removed
set to list: aNewList = list(myset)
list to tuple: aNewTuple = tuple(mylist)
tuple to list: aNewList = list(mytuple)

## List comprehension

```
result = [x for x in xrange(10) if x % 2 == 0]
print result #will be 2 4 6 8
```

## Ternary operator

a = 1 if some_condition else 2

## Reference or Value

Every object is a reference to memory. python will collect an object if there is no reference to it.

you can use copy to clone a object

```
import copy
#simple copy, like in C++, just copy it if there is no pointer member
aNewList = copy.copy(theOldList)
#like in C++, deep copy is required if there's any pointer member
aNewList = copy.deepcopy(theOldList) 
```

