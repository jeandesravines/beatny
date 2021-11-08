# Contributing

## Merge requests

Merge requests are used to share the knowledge through all contributors and ask them to offer their opinion about the in progress features.

### Settings

- All merge requests must be rebased from develop
- All commits have to be squashed before be merge to develop
- After being merged, the original branch have to be removed

### Commit message convention

Commits should use a common format to ease their readability.
We recommend this format: `type(scope): user_story_title (#ticket_number)`.
For a story `#42` named "Save user's tracks", the title should be `feat(User): Save user's tracks (#42)`.

#### Types

We prefix our commit messages with one of the following to signify the kind of change:

- **build**: Changes that affect the build system or external dependencies
- **ci**, **chore**: Changes to our CI configuration files and scripts
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code
- **test**: Adding missing tests or correcting existing tests

## Definition of "Done"

This list constitutes the set of required criteria to declare a story as "done".

- Acceptance criteria accepted
- Code linted
- Tests written (if applicable)
- Tests passed on CI (via Docker)
- Project buildable on CI (via Docker)
- Code reviewed and approved via a merge request
