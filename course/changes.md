# Tracking Changes

First let's make sure we're still in the right directory. You should be in the `planets` directory.

```bash
$ pwd
```

```output
h:\planets
```

Let's create a file called `mars.txt` that contains some notes about the Red Planet. We'll use `nano` to edit the file; you can use whatever editor you like.
In particular, this does not have to be the `core.editor` you set globally earlier. But remember, the bash command to create or edit a new file will depend on the editor you choose (it might not be `nano`).

```bash
$ nano mars.txt
```

Type the text below into the `mars.txt` file:

```
Cold and dry, but everything is my favourite colour
```

`mars.txt` now contains a single line, which we can see by running:

```bash
$ ls
```

```output
mars.txt
```

```bash
$ cat mars.txt
```

```output
Cold and dry, but everything is my favourite colour
```

If we check the status of our project again, Git tells us that it's noticed the new file:

```bash
$ git status
```

```output
On branch master

Initial commit

Untracked files:
   (use “git add <file>...” to include in what will be committed)

	mars.txt
nothing added to commit but untracked files present (use “git add” to track)
```

The “untracked files” message means that there's a file in the directory that Git isn't keeping track of. We can tell Git to track a file using `git add`:

```bash
$ git add mars.txt
```

and then check that the right thing happened:

```bash
$ git status
```

```output
On branch master

Initial commit

Changes to be committed:
  (use “git rm --cached <file>...” to unstage)

	new file:   mars.txt

```

Git now knows that it's supposed to keep track of `mars.txt`, but it hasn't recorded these changes as a commit yet. To get it to do that, we need to run one more command:

```bash
$ git commit -m “Start notes on Mars"
```

```output
[master (root-commit) f22b25e] Start notes on Mars
 1 file changed, 1 insertion(+)
 create mode 100644 mars.txt
```

When we run `git commit`, Git takes everything we have told it to save by using `git add` and stores a copy permanently inside the `.git` directory. This permanent copy is called a [commit](reference#commit) (or [revision](reference#revision)) and its short identifier is `f22b25e`. Your commit may have another identifier.

We use the `-m` flag (for “message") to record a short, descriptive, and specific comment that will help us remember later on what we did and why. If we run `git commit` without the `-m` option, Git will launch `nano` (or whatever other editor we configured as `core.editor`) so that we can write a longer message.

[Good commit messages][commit-messages] start with a brief (<50 characters) statement about the changes made in the commit. Generally, the message should complete the sentence “If applied, this commit will” <commit message here>. If you want to go into more detail, add a blank line between the summary line and your additional notes. Use this additional space to explain why you made changes and/or what their impact will be.

If we run `git status` now:

```bash
$ git status
```

```output
On branch master
nothing to commit, working directory clean
```

it tells us everything is up to date. If we want to know what we've done recently, we can ask Git to show us the project's history using `git log`:

```bash
$ git log
```

```output
commit f22b25e3233b4645dabd0d81e651fe074bd8e73b
Author: User Name <NameU@cardiff.ac.uk>
Date:   Thu Aug 22 09:51:46 2013 -0400

    Start notes on Mars
```

`git log` lists all commits made to a repository in reverse chronological order. The listing for each commit includes the commit's full identifier (which starts with the same characters as the short identifier printed by the `git commit` command earlier), the commit's author, when it was created, and the log message Git was given when the commit was created.

> #### Where Are My Changes?
>
> If we run `ls` at this point, we will still see only one file called `mars.txt`.
> That's because Git saves information about files' history
> in the `.git` directory mentioned earlier
> so that our filesystem doesn't become cluttered
> (and so that we can't accidentally edit or delete an old version).

Now suppose we add more information to the file. (Again, we'll edit with `nano` and then `cat` the file to show its contents; you may use a different editor, and don't need to `cat`.) Open the file, and add the line below:

```
It is quite far away from home
```

Now check the file contents:

```bash
$ nano mars.txt
$ cat mars.txt
```

```output
Cold and dry, but everything is my favourite colour
It is quite far away from home
```

When we run `git status` now, it tells us that a file it already knows about has been modified:

```bash
$ git status
```

```
On branch master
Changes not staged for commit:
  (use “git add <file>...” to update what will be committed)
  (use “git checkout -- <file>...” to discard changes in working directory)

	modified:   mars.txt

no changes added to commit (use “git add” and/or “git commit -a")
```

The last line is the key phrase: “no changes added to commit". We have changed this file, but we haven't told Git we will want to save those changes (which we do with `git add`) nor have we saved them (which we do with `git commit`). So let's do that now. It is good practice to always review our changes before saving them. We do this using `git diff`. This shows us the differences between the current state
of the file and the most recently saved version:

```bash
$ git diff
```

```output
diff --git a/mars.txt b/mars.txt
index df0654a..315bf3a 100644
--- a/mars.txt
+++ b/mars.txt
@@ -1 +1,2 @@
 Cold and dry, but everything is my favourite colour
+It is quite far away from home
```

The output is cryptic because it is actually a series of commands for tools like editors and `patch` telling them how to reconstruct one file given the other.
If we break it down into pieces:

1. The first line tells us that Git is producing output similar to the Unix `diff` command comparing the old and new versions of the file.
2. The second line tells exactly which versions of the file Git is comparing; `df0654a` and `315bf3a` are unique computer-generated labels for those versions.
3. The third and fourth lines once again show the name of the file being changed.
4. The remaining lines are the most interesting, they show us the actual differences and the lines on which they occur. In particular, the `+` marker in the first column shows where we added a line.

After reviewing our change, it's time to commit it:

```bash
$ git commit -m “Add concerns about distance of travel to Mars"
$ git status
```

```
On branch master
Changes not staged for commit:
  (use “git add <file>...” to update what will be committed)
  (use “git checkout -- <file>...” to discard changes in working directory)

	modified:   mars.txt

no changes added to commit (use “git add” and/or “git commit -a")
```

Whoops: Git won't commit because we didn't use `git add` first. Let's fix that:

```bash
$ git add mars.txt
$ git commit -m “Add concerns about distance of travel to Mars"
```

```output
[master 34961b1] Add concerns about distance of travel to Mars
 1 file changed, 1 insertion(+)
```

Git insists that we add files to the set we want to commit before actually committing anything. This allows us to commit our changes in stages and capture changes in logical portions rather than only large batches. For example, suppose we're adding a few citations to relevant research to our coursework. We might want to commit those additions, and the corresponding bibliography entries, but _not_ commit some of our work drafting the conclusion (which we haven't finished yet).

To allow for this, Git has a _staging area_ where it keeps track of things that have been added to the current [changeset](reference#changeset) but not yet committed.

> #### Staging Area
>
> If you think of Git as taking snapshots of changes over the life of a project,
> `git add` specifies _what_ will go in a snapshot
> (putting things in the staging area),
> and `git commit` then _actually takes_ the snapshot, and
> makes a permanent record of it (as a commit).
> If you don't have anything staged when you type `git commit`,
> Git will prompt you to use `git commit -a` or `git commit --all`,
> which is kind of like gathering _everyone_ for the picture!
> However, it's almost always better to
> explicitly add things to the staging area, because you might
> commit changes you forgot you made. (Going back to snapshots,
> you might get the extra with incomplete makeup walking on
> the stage for the snapshot because you used `-a`)
> Try to stage things manually,
> or you might find yourself searching for “git undo commit” more
> than you would like!

![The Git Staging Area](_img/git-staging-area.svg)

Let's watch as our changes to a file move from our editor to the staging area
and into long-term storage. First, we'll add another line to the file:

```bash
$ nano mars.txt
$ cat mars.txt
```

```output
Cold and dry, but everything is my favourite colour
It is quite far away from home
And there is very little phone signal
```

```bash
$ git diff
```

```output
diff --git a/mars.txt b/mars.txt
index 315bf3a..b36abfd 100644
--- a/mars.txt
+++ b/mars.txt
@@ -1,2 +1,3 @@
 Cold and dry, but everything is my favourite colour
 It is quite far away from home
+And there is very little phone signal
```

So far, so good: we've added one line to the end of the file (shown with a `+` in the first column). Now let's put that change in the staging area and see what `git diff` reports:

```bash
$ git add mars.txt
$ git diff
```

There is no output: as far as Git can tell, there's no difference between what it's been asked to save permanently and what's currently in the directory.
However, if we do this:

```bash
$ git diff --staged
```

```output
diff --git a/mars.txt b/mars.txt
index 315bf3a..b36abfd 100644
--- a/mars.txt
+++ b/mars.txt
@@ -1,2 +1,3 @@
 Cold and dry, but everything is my favourite colour
 It is quite far away from home
+And there is very little phone signal
```

it shows us the difference between the last committed change
and what's in the staging area. Let's save our changes:

```
$ git commit -m “Discuss concerns about lack of connectivity"
```

```
[master 005937f] Discuss concerns about lack of connectivity
 1 file changed, 1 insertion(+)
```

check our status:

```
$ git status
```

```
On branch master
nothing to commit, working directory clean
```

and look at the history of what we've done so far:

```
$ git log
```

```
commit 005937fbe2a98fb83f0ade869025dc2636b4dad5
Author: User Name <NameU@cardiff.ac.uk>
Date:   Thu Aug 22 10:14:07 2013 -0400

    Discuss concerns about lack of connectivity

commit 34961b159c27df3b475cfe4415d94a6d1fcd064d
Author: User Name <NameU@cardiff.ac.uk>
Date:   Thu Aug 22 10:07:21 2013 -0400

    Add concerns about distance of travel to Mars

commit f22b25e3233b4645dabd0d81e651fe074bd8e73b
Author: User Name <NameU@cardiff.ac.uk>
Date:   Thu Aug 22 09:51:46 2013 -0400

    Start notes on Mars
```

> #### Word-based diffing
>
> Sometimes, e.g. in the case of the text documents a line-wise diff is too coarse. That is where the `--color-words` option of `git diff` comes in very useful as it highlights the changed words.

&nbsp;

> #### Paging the Log
>
> When the output of `git log` is too long to fit in your screen, `git` uses a program to split it into pages of the size of your screen. When this “pager” is called, you will notice that the last line in your screen is a `:`, instead of your usual prompt.
>
> -   To get out of the pager, press <kbd>Q</kbd>.
> -   To move to the next page, press <kbd>Spacebar</kbd>.
> -   To search for `some_word` in all pages,
>     press <kbd>/</kbd>
>     and type `some_word`.
>     Navigate through matches pressing <kbd>N</kbd>.

&nbsp;

> #### Limit Log Size
>
> To avoid having `git log` cover your entire terminal screen, you can limit the number of commits that Git lists by using `-N`, where `N` is the number of commits that you want to view. For example, if you only want information from the last commit you can use:
>
> ```bash
> $ git log -1
> ```
>
> ```output
> commit 005937fbe2a98fb83f0ade869025dc2636b4dad5
> Author:  User Name <NameU@cardiff.ac.uk>
> Date:   Thu Aug 22 10:14:07 2013 -0400
>
>    Discuss concerns about lack of connectivity
> ```
>
> You can also reduce the quantity of information using the
> `--oneline` option:
>
> ```bash
> $ git log --oneline
> ```
>
> ```output
> * 005937f Discuss concerns about lack of connectivity
> * 34961b1 Add concerns about distance of travel
> * f22b25e Start notes on Mars
> ```
>
> You can also combine the `--oneline` options with others. One useful combination is:
>
> ```
> $ git log --oneline --graph --all --decorate
> ```
>
> ```
> * 005937f Discuss concerns about lack of connectivity (HEAD, master)
> * 34961b1 Add concerns about distance of travel
> * f22b25e Start notes on Mars
> ```

&nbsp;

> #### Directories
>
> Two important facts you should know about directories in Git.
>
> 1.  Git does not track directories on their own, only files within them.
>     Try it for yourself:
>
>         ```
>         $ mkdir directory
>         $ git status
>         $ git add directory
>         $ git status
>         ```
>
>     <!-- alex disable special -->
>
>         Note, our newly created empty directory `directory` does not appear in the list of untracked files even if we explicitly add it (_via_ `git add`) to our repository. This is the reason why you will sometimes see `.gitkeep` files in otherwise empty directories. Unlike `.gitignore`, these files are not special and their sole purpose is to populate a directory so that Git adds it to the repository. In fact, you can name such files anything you like.
>
> <!-- alex enable special -->
>
> 2. If you create a directory in your Git repository and populate it with files, you can add all files in the directory at once by:
>
>     ```
>     git add <directory-with-files>
>     ```

To recap, when we want to add changes to our repository, we first need to add the changed files to the staging area (`git add`) and then commit the staged changes to the repository (`git commit`):

![The Git Commit Workflow](_img/git-committing.svg)

> ## Exercise: Choosing a Commit Message
>
> Which of the following commit messages would be most appropriate for the last commit made to `mars.txt`?
>
> 1. “Changes"
> 2. “Added line 'And there is very little phone signal' to mars.txt"
> 3. “Discuss lack of phone signal on Mars"
>
> #### Solution
>
> Answer 1 is not descriptive enough, and the purpose of the commit is unclear; and answer 2 is redundant to using “git diff” to see what changed in this commit; but answer 3 is good: short, descriptive, and imperative.

&nbsp;

> ## Exercise: Committing Multiple Files
>
> The staging area can hold changes from any number of files that you want to commit as a single snapshot.
>
> 1. Add some text to `mars.txt`
> 2. Create a new file `venus.txt` with your initial thoughts about Venus
> 3. Add changes from both files to the staging area, and commit those changes.
>
> #### Solution
>
> First we make our changes to the `mars.txt` and `venus.txt` files:
>
> ```bash
> $ nano mars.txt
> $ cat mars.txt
> ```
>
> ```
> Mars is also a planet with a four-letter name.
> ```
>
> ```bash
> $ nano venus.txt
> $ cat venus.txt
> ```
>
> ```
> Venus is a nice planet.
> ```
>
> Now you can add both files to the staging area. We can do that in one line:
>
> ```bash
> $ git add mars.txt venus.txt
> ```
>
> Or with multiple commands:
>
> ```bash
> $ git add mars.txt
> $ git add venus.txt
> ```
>
> Now the files are ready to commit. You can check that using `git status`. If you are ready to commit use:
>
> ```bash
> $ git commit -m “Write some notes on Venus"
> ```
>
> ```output
> [master cc127c2]
>  Write some notes on Venus
>  2 files changed, 2 insertions(+)
>  create mode 100644 venus.txt
> ```

&nbsp;

> ## Exercise: `bio` Repository
>
> -   Create a new Git repository on your computer called `bio`.
> -   Write a three-line biography for yourself in a file called `me.txt`, commit your changes
> -   Modify one line, add a fourth line
> -   Display the differences between its updated state and its original state.

&nbsp;

> ## Exercise: Author and Committer
>
> For each of the commits you have done, Git stored your name twice. You are named as the author and as the committer. You can observe that by telling Git to show you more information about your last commits:
>
> ```bash
> $ git log --format=full
> ```
>
> When committing you can name someone else as the author:
>
> ```
> $ git commit --author=“Another User <UserA@cardiff.ac.uk>”
> ```
>
> Create a new repository and create two commits: one without the `--author` option and one by naming a colleague of yours as the > author. Run `git log` and `git log --format=full`. Think about ways how that can allow you to collaborate with your colleagues.

[commit-messages]: https://chris.beams.io/posts/git-commit/
