---
layout : post
title : Chain Multiple Converters
tags : [WPF]
category : WPF
original: true
---

This article describes how to chain multiple WPF value converters into a set, like most command-line environments that allow the output of one command to be piped into another command as input. It enables and encourages us write reusable converters and combine them to gain a new powerful converter, rather than write all the conversion code in one single converter. 

Let say we need to converter `false` to `Visible`, `true` to `Collapse`. Of course we can write a new `FalseToVisibleConverter` to get the job done, but following this style could result in a huge number of specific non-reusable converters as we may have lots of combinations. The better way is to combine/pipe/reuse the `InverseBoolConverter` (A wildly used custom converter to inverse `true` to `false` and vice versa) and the existing `BooleanToVisibilityConverter` (Provided by WPF, which can convert `true` to `Visible` and `false` to `Collapse`).

<!--more-->

## The solution

So now the challenge is to create a `CompositeConverter` to pipe the Converters. It must implement `IValueConverter` so the UI can use it like a normal converter. When its `Convert` method is invoked, it iterates the converters it contains and calls each `Convert` method with the result from the previous converter.

Here is the brief implementaion:

    public class CompositeConverter : IValueConverter {
        public object Convert(object value, Type targetType, 
            object parameter, CultureInfo culture) {
            foreach (var converter in Converters) {
                value = converter.Convert(value, targetType, parameter, culture);
            }
            return value;
        }

        public List<IValueConverter> Converters { get; } = new List<IValueConverter>();
    }

And in Xaml, we can use the `CompositeConverter` like below:

    xmlns:convs='...the namespace where CompositeConverter resides...'
    <TextBox>
        <TextBox.Visibility>
            <Binding Path="..." ...>
                <Binding.Converter>
                    <convs:CompositeConverter>
                        <convs:InverseBoolConverter/>
                        <BooleanToVisibilityConverter/>
                    </convs:CompositeConverter>
                </Binding.Converter>
            </Binding>
        </TextBox.Visibility>
    </TextBox>

Or we can create a resource, and use it everywhere by refering to its key:

    <Window
        xmlns:convs='...the namespace where CompositeConverter resides...'>

        <Window.Resources>
            <convs:CompositeConverter x:key="FalseToVisibleConverter">
                <convs:InverseBoolConverter/>
                <BooleanToVisibilityConverter/>
            </convs:CompositeConverter>
        </Window.Resources> 
        <TextBox>
            <TextBox.Visibility>
                <Binding Path="..." Converter="{StaticResource FalseToVisibleConverter}">
                </Binding>
            </TextBox.Visibility>
        </TextBox>
    </Window>

One thing I forgot to mention is that to enable the ability to specify converters in Xaml, we need to add a ContentProperty attribute to the `CompositeConverter` class to indicate which property we want to store the converters.

    [ContentProperty("Converters")]
    public class CompositeConverter : IValueConverter{
        ...
        public List<IValueConverter> Converters { get; } = new List<IValueConverter>();
    }

## Extra

### DependencyProperty.UnsetValue

We need to stop the conversion in case the property hasn't been set when binding is being performed.

    public object Convert(object value, Type targetType, 
            object parameter, CultureInfo culture) {
        if (value == DependencyProperty.UnsetValue) {
            return value;
        }
        ...


### Binding.DoNothing

If a value converter cannot return a meaningful output value in response to the input value, it can instead return Binding.DoNothing, to instruct the data binding engine not to perform any action.
    
    foreach (var converter in Converters) {
        value = converter.Convert(value, targetType, parameter, culture);
        if(value == Binding.DoNothing) return Binding.DoNothing;
    }

### ConvertBack

The implementation of `ConvertBack` method is very similar to the `Convert`, it just needs to iterate the `Converters` in an oppsite direction and call the `ConvertBack` method for each converter.

## Finalised Solution

Now let's combine all together.

    [ContentProperty("Converters")]
    public class CompositeConverter : IValueConverter {
        public object Convert(object value, Type targetType, 
            object parameter, CultureInfo culture) {
            if (value == DependencyProperty.UnsetValue) {
               return value;
            }
            foreach (var converter in Converters) {
                value = converter.Convert(value, targetType, parameter, culture);
                if(value == Binding.DoNothing) return Binding.DoNothing;
            }
            return value;
        }
        public List<IValueConverter> Converters { get; } = new List<IValueConverter>();
    }