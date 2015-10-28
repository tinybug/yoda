![Yoda Title](https://s3-us-west-2.amazonaws.com/github.whoisandie.com/yoda-title.png)

Yoda is a nifty windows application which enables you to browse and download videos from YouTube.
Built using [ReactJS](https://facebook.github.io/react) & [Electron](http://electron.atom.io)

![Yoda Screenshot](http://i.imgur.com/7TJwweb.png)

## Downloads
Release package comming soon !
Please note that currently supports windows.

## Play
Just click play button, you can play the video immediately
http://i.imgur.com/2gNDhew.png

## Developers
Requires gulp to be installed on your machine.
Clone the repository, install dependencies and run `gulp`

``` bash
git clone https://github.com/tinybug/yoda.git

# Cd into the directory and install dependencies
cd yoda && npm install

# Run gulp to start
gulp
```

## Debug
You can add 'debugger' to the code, just like
``` javascript
 // in src/scripts/actios/Actions.js
 download(video, filename) {
  //it will stop here
  debugger;
  Ydm.download(video, filename).then(download => {
    this.dispatch({
      id: download.id,
      title: download.title,
      path: download.path
    });

    this.actions.status();
    this.actions.snapshot();
    this.actions.progress(download);
  });
}
```
![Yoda Screenshot](http://i.imgur.com/8dpGVMm.png)

To build a disk image, run `gulp release`, which will run the necessary tasks
and create the disk image in a `dist` directory.

## Contribution

Want to make a contribution ? Fork the repo, tweak, add your changes, submit a pull request :) And yes any type of contributions (ideas, bug fixes, fixing typos, etc.) will be appreciated !

## License

Copyright (c) 2015
