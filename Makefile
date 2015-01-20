SRC=$(shell find lib -type f -name "*.js")
BUILD = $(subst lib/,build/,$(SRC))
REPORTER = spec

all: test
install:
	@npm install
test:
	@node node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha \
		-- \
		--reporter spec \
		--timeout 10000
travis: install
	@NODE_ENV=test ./node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		--report lcovonly \
		--test/*.test.js
jshint:
	@./node_modules/jshint/bin/jshint .
.PHONY: test
