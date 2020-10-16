# Setting up Git

When we use Git on a new computer for the first time, we need to configure a few things. Below are a few examples of configurations we will set as we get started with Git:

-   our name and email address,
-   what our preferred text editor is,
-   and that we want to use these settings globally (i.e. for every project).

On a command line, Git commands are written as `git verb`, where `verb` is what we actually want to do. So, if we open up a command line on our computer, here is how we can set up Git on our account to know who we are:

```bash
$ git config --global user.name "MY NAME"
$ git config --global user.email "NAMEM@cardiff.ac.uk"
```

!> Please remember to use your own name and email address!

This user name and email will be associated with your subsequent Git activity, which means that any changes pushed to our [Gitlab server](https://git.cardiff.ac.uk) will include this information.

We can also set our favourite text editor, following this table:

| Editor                                | Configuration command                                                                                                            |
| :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------- |
| Atom                                  | `$ git config --global core.editor "atom --wait"`                                                                                |
| nano                                  | `$ git config --global core.editor "nano -w"`                                                                                    |
| BBEdit (Mac, with command line tools) | `$ git config --global core.editor "bbedit -w"`                                                                                  |
| Sublime Text (Mac)                    | `$ git config --global core.editor "/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl -n -w"`                      |
| Sublime Text (Win, 32-bit install)    | `$ git config --global core.editor "'c:/program files (x86)/sublime text 3/sublime_text.exe' -w"`                                |
| Sublime Text (Win, 64-bit install)    | `$ git config --global core.editor "'c:/program files/sublime text 3/sublime_text.exe' -w"`                                      |
| Notepad++ (Win, 32-bit install)       | `$ git config --global core.editor "'c:/program files (x86)/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"` |
| Notepad++ (Win, 64-bit install)       | `$ git config --global core.editor "'c:/program files/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"`       |
| Kate (Linux)                          | `$ git config --global core.editor "kate"`                                                                                       |
| Gedit (Linux)                         | `$ git config --global core.editor "gedit --wait --new-window"`                                                                  |
| Scratch (Linux)                       | `$ git config --global core.editor "scratch-text-editor"`                                                                        |
| Emacs                                 | `$ git config --global core.editor "emacs"`                                                                                      |
| Vim                                   | `$ git config --global core.editor "vim"`                                                                                        |

It is possible to reconfigure the text editor for Git whenever you want to change it. On your University provided laptop, unless you are comfortable with a command line editor like Vim or Emacs, we would suggest you use Atom.

> #### Exiting Vim
>
> Note that Vim is the default editor for many programs. If you haven't used Vim before and wish to exit a session without saving your changes, press <kbd>Esc</kbd> then type `:q!` and hit <kbd>Return</kbd>.
> If you want to save your changes and quit, press <kbd>Esc</kbd> then type `:wq` and hit <kbd>Return</kbd>.

The commands we ran above only need to be run once: the flag `--global` tells Git to use the settings for every project when you are logged on using your user account.

You can check your settings at any time:

```bash
$ git config --list
```

You can change your configuration as many times as you want: use the same commands to choose another editor or update your email address.

> ## Git Help and Manual
>
> Always remember that if you forget a `git` command, you can access the list of commands by using `-h` and access the Git manual by using `--help` :
>
> ```bash
> $ git config -h
> $ git config --help
> ```
