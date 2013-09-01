//Requires has function.

Object.defineProperty( Object.prototype, "put",
	{
		"enumerable": false,
		"configurable": true,
		"writable": false,
		"value": function put( key, value, options ){

			if( arguments.length <= 2 ){
				//It is safe to assume that the first
				//	argument is an object.
				var values = { };
				if( typeof arguments[ 0 ] == "object" ){
					values = arguments[ 0 ];
				}else if( typeof arguments[ 0 ] == "string" ){
					key = arguments[ 0 ];
					values = undefined;
				}

				if( arguments[ 1 ] ){
					options = arguments[ 1 ];
				}

				if( values ){
					for( var property in values ){
						this.put( property, values[ property ], options );
					}
					return this;	
				}
			}

			if( !options ){
				options = "public editable";
			}

			var overwrite;
			if( typeof options == "string" ){
				options = options.toLowerCase( );

				var regexPublic = /public/g;
				var regexPrivate = /private/g;
				var regexReadOnly = /read-only/g;
				var regexWritable = /writable/g;
				var regexConstant = /constant/g;
				var regexOverwrite = /overwrite/g;
				var regexDefault = /default/g;
				var regexDefaultValue = /default(?:\:(number|string|boolean|object|function))?/;
				var regexDefaultObject = /default:object(?:-([\w$][\w\d]*))?/;
				var regexDefaultFunction = /default:function(?:-([\w$][\w\d]*))?/;
				var regexFunction = /function-([\w$][\w\d]*\([^\(\)]*\)\s+\{.*\})/;

				var configuration = { };
				
				if( regexPublic.test( options )
					&& options.match( regexPublic ).length == 1
					&& !regexPrivate.test( options ) )
				{
					configuration.enumerable = true;
				}else if( regexPrivate.test( options )
					&& options.match( regexPrivate ).length == 1
					&& !regexPublic.test( options ) )
				{
					configuration.enumerable = false;	
				}else{
					configuration.enumerable = true;
				}

				if( regexReadOnly.test( options )
					&& options.match( regexReadOnly ).length == 1
					&& !regexWritable.test( options ) )
				{
					configuration.writable = false;
				}else if( regexWritable.test( options )
					&& options.match( regexWritable ).length == 1
					&& !regexReadOnly.test( options ) )
				{
					configuration.writable = true;
				}else{
					configuration.writable = true;
				}

				if( regexConstant.test( options )
					&& options.match( regexConstant ).length == 1
					&& !regexReadOnly.test( options )
					&& !regexWritable.test( options ) )
				{
					configuration.configurable = false;
					configuration.writable = false;
				}else{
					configuration.configurable = true;
				}

				if( value === undefined
					&& regexDefaultValue.test( options )
					&& options.match( regexDefault ).length == 1 )
				{
					var defaultType = options.match( regexDefaultValue )[ 1 ];
					switch( defaultType ){
						case "number":
							value = 0;
							break;

						case "string":
							value = "";
							break;

						case "boolean":
							value = false;
							break;

						case "object":
							var className = options.match( regexDefaultObject )[ 1 ];
							if( blueprint ){
								try{
									value = new eval( className )( );
								}catch( error ){
									error.out( );
									value = null;
								}
							}else{
								value = { };
							}
							break;

						case "function":
							var functionName = options.match( regexDefaultFunction )[ 1 ];
							if( functionName ){
								var functionDefinition = options.match( regexFunction )[ 1 ];
								if( functionDefinition ){
									functionDefinition = "function " + functionDefinition;
									eval( "value = " + functionDefinition + ";" );	
								}
							}
							if( !value ){
								value = function( ){ };
							}
							break;

						default:
							value = null;
					}
				}

				if( regexOverwrite.test( options )
					&& this.has( key ) )
				{
					overwrite = true;	
				}else if( this.has( key ) ){
					overwrite = false;
				}

				options = configuration;
			}

			if( typeof options == "object" ){
				for( var option in options ){
					if( option == "enumerable"
						|| option == "configurable"
						|| option == "writable" )
					{
						continue;
					}else{
						delete options[ option ];
					}
				}	
			}

			if( value === undefined ){
				value = null;
			}

			options.value = value;

			if( ( overwrite && typeof overwrite == "boolean" ) 
				|| overwrite === undefined )
			{
				Object.defineProperty( this, key, options );	
			}
			
			return this;			
		}
	} );