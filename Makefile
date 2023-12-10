default: help

.PHONY: setup run clean-branches

setup: ## runs: project dependencies
	@echo "instalando yarn"
	@npm install -g yarn

	@echo "limpando cache do yarn"
	@yarn cache clean

	@echo "instalando serveless"
	@yarn global add serverless

	@echo "limpando projeto"
	@yarn clean

	@echo "instalando dependencias do projeto"
	@yarn install


run: ## runs: serveless local
	@sls offline start

clean-branches: ##@misc delete local branches removed from origin
	@echo "Prune origin"
	@git remote prune origin
	@echo "Delete local branches removed from origin"
	@git branch -vv | grep "origin/.*: gone]" | awk '{print $$1}' | xargs git branch -D
	@echo "Cleaning local merged branches"
	@git branch --merged develop | egrep -v "(^\*|master|develop|QA)" |  xargs -n 1 git branch -d


help: ##@miscellaneous Show this help.
	@echo $(MAKEFILE_LIST)
	@perl -e '$(HELP_FUNC)' $(MAKEFILE_LIST)

# helper function for printing target annotations
# ripped from https://gist.github.com/prwhite/8168133
HELP_FUNC = \
	%help; \
	while(<>) { \
		if(/^([a-z0-9_-]+):.*\#\#(?:@(\w+))?\s(.*)$$/) { \
			push(@{$$help{$$2}}, [$$1, $$3]); \
		} \
	}; \
	print "usage: make [target]\n\n"; \
	for ( sort keys %help ) { \
		print "$$_:\n"; \
		printf("  %-20s %s\n", $$_->[0], $$_->[1]) for @{$$help{$$_}}; \
		print "\n"; \
	}