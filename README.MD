### 基础环境node，npm-npx，yarn，Python2
```
C:\Python27
```

### 安装和配置jdk
```
jdk百度网盘有
JAVA_HOME C:\Java\jdk1.8
CLASSPATH  .;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar
PATH  %JAVA_HOME%\bin
PATH  %JAVA_HOME%\jre\bin
```

### 安装
```
安装包百度网盘有
ANDROID_HOME D:\Android\sdk
PATH  %ANDROID_HOME%\platform-tools
PATH  %ANDROID_HOME%\emulator
PATH  %ANDROID_HOME%\tools
```

### 使用nrm工具切换淘宝源
```
npx nrm use taobao npm install -g yarn npx react-native init myapp cd myapp yarn android
```
### 新建项目
```
npx react-native init myApp
cd myApp
yarn react-native run-android
```
### 修改包名
```
搜索 com.myapp ==> com.my.app 修改 android-app-src-main 中的目录
```

### 启动页配置-Android
```
yarn add react-native-splash-screen
跳过插件上说的自动和手动链接，0.61版本以后不需要
main/res中准备启动页资源
layout布局声明
res/values/colors.xml 设置状态栏颜色
res/values/styles.xml 设置背景透明防止白屏
MainActivity.java 文件修改

package com.cjread.tuibook;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "cjreadChuyue";
  }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, true);  // 添加这一句
    super.onCreate(savedInstanceState);
  }
}
  
8.控制启动页隐藏
import SplashScreen from 'react-native-splash-screen'  
SplashScreen.hide();
```

### ios项目初始化
```
1. cd ios
pod install

2. rm -rf node_modules
npm install

3. npm start -- --reset-cache
react-native run-ios

```

### 启动页配置-ios
```
1. 跳过关联步骤
2. 配置启动图
3. #import "RNSplashScreen.h"  // here
[RNSplashScreen show];  // here

4. react-native run-ios --device 9527
```

### Android打包
```
android\gradle\gradle-wrapper.properties
distributionUrl=https\://services.gradle.org/distributions/gradle-5.5-all.zip
$ cd android
$ ./gradlew assembleRelease
```