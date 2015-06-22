Adapted from the code used to generate the official node.js docs.

# Usage

You can generate html and json for single files in your **package.json** scripts.

    {
      "scripts": {
        "generate-html": "node-doc-generator doc/index.md --format=html 
          --template=doc/template.html",
        "generate-json": "node-doc-generator doc/index.md --format=json"
      }
    }

Alternatively you can pool all your documentation from included packages into one folder. This will look inside the '~/doc' sub-directory of each package that's included and output the pooled results into the specified output dir of **this** package. This means that each included package has to follow the convention of putting it's markdown docs inside the 'doc' sub folder.

    {
      "scripts": {
        "generate-html": "generate-package-docs @alastair/pbx-providesql 
          @alastair/pbx-ui @alastair/pbx-api @alastair/pbx-rules 
          @alastair/pbx-product-export --outputDir=doc --format=html 
          --template=doc/template.html",
        "generate-json": "generate-package-docs @alastair/pbx-providesql 
          @alastair/pbx-ui @alastair/pbx-api @alastair/pbx-rules 
          @alastair/pbx-product-export --outputDir=doc --format=json"
      }
    }

See the examples directory of this package for an example html template.

# How to write the documentation

The docs should be written in markdown and follow these rules from the original node.js docs readme..

Here's how the node docs work.

1:1 relationship from `lib/<module>.js` to `doc/api/<module>.markdown`

Each type of heading has a description block.


    ## module

        Stability: 3 - Stable

    description and examples.

    ### module.property

    * Type

    description of the property.

    ### module.someFunction(x, y, [z=100])

    * `x` {String} the description of the string
    * `y` {Boolean} Should I stay or should I go?
    * `z` {Number} How many zebras to bring.

    A description of the function.

    ### Event: 'blerg'

    * Argument: SomeClass object.

    Modules don't usually raise events on themselves.  `cluster` is the
    only exception.

    ## Class: SomeClass

    description of the class.

    ### Class Method: SomeClass.classMethod(anArg)

    * `anArg` {Object}  Just an argument
      * `field` {String} anArg can have this field.
      * `field2` {Boolean}  Another field.  Default: `false`.
    * Return: {Boolean} `true` if it worked.

    Description of the method for humans.

    ### someClass.nextSibling()

    * Return: {SomeClass object | null}  The next someClass in line.

    ### someClass.someProperty

    * String

    The indication of what someProperty is.

    ### Event: 'grelb'

    * `isBlerg` {Boolean}

    This event is emitted on instances of SomeClass, not on the module itself.


* Modules have (description, Properties, Functions, Classes, Examples)
* Properties have (type, description)
* Functions have (list of arguments, description)
* Classes have (description, Properties, Methods, Events)
* Events have (list of arguments, description)
* Methods have (list of arguments, description)
* Properties have (type, description)

## Stability ratings: 0-5

These can show up below any section heading, and apply to that section.

0 - Deprecated.  This feature is known to be problematic, and changes are
planned.  Do not rely on it.  Use of the feature may cause warnings.  Backwards
compatibility should not be expected.

1 - Experimental.  This feature was introduced recently, and may change
or be removed in future versions.  Please try it out and provide feedback.
If it addresses a use-case that is important to you, tell the node core team.

2 - Unstable.  The API is in the process of settling, but has not yet had
sufficient real-world testing to be considered stable. Backwards-compatibility
will be maintained if reasonable.

3 - Stable.  The API has proven satisfactory, but cleanup in the underlying
code may cause minor changes.  Backwards-compatibility is guaranteed.

4 - API Frozen.  This API has been tested extensively in production and is
unlikely to ever have to change.

5 - Locked.  Unless serious bugs are found, this code will not ever
change.  Please do not suggest changes in this area, they will be refused.
