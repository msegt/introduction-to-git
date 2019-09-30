# Creating a Repository

Once Git is configured, we can start using it.

First, let's create a directory for our work and then move into that directory:

```bash
$ cd ~
$ mkdir planets
$ cd planets
```

Then we tell Git to make `planets` a [repository](reference#repository)—a place where Git can store versions of our files:

```bash
$ git init
```

It is important to note that `git init` will create a repository that includes subdirectories and their files - there is no need to create separate repositories nested within the `planets` repository, whether subdirectories are present from the beginning or added later. Also, note that the creation of the `planets` directory and its initialization as a repository are completely separate processes.

If we use `ls` to show the directory's contents, it appears that nothing has changed:

```bash
$ ls
```

But if we add the `-a` switch to show everything, we can see that Git has created a hidden directory within `planets` called `.git`:

```bash
$ ls -a
```

Git uses this special sub-directory to store all the information about the project, including all files and sub-directories located within the project's directory. If we ever delete the `.git` sub-directory, we will lose the project's history.

We can check that everything is set up correctly by asking Git to tell us the status of our project:

```bash
$ git status
```

```bash
# On branch master
#
# Initial commit
#
nothing to commit (create/copy files and use "git add" to track)
```

If you are using a different version of `git`, the exact wording of the output might be slightly different.
