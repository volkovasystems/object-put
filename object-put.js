Object.defineProperty( Object.prototype, "put",
	{
		"enumerable": false,
		"configurable": true,
		"writable": false,
		"value": function put( key, value, options ){

			if( !options ){
				options = "public editable";
			}

			if( typeof options == "string" ){
				options = options.toLowerCase( );

				var regexPublic = /public/;
				var regexPrivate = /private/;
				var regexReadOnly = /read-only/;
				var regexWritable = /writable/;
				var regexConstant = /constant/;

				var configuration = { };
				
				if( regexPublic.test( options )
					&& !regexPrivate.test( options ) )
				{
					configuration.enumerable = true;
				}else if( regexPrivate.test( options )
					&& !regexPublic.test( options ) )
				{
					configuration.enumerable = false;	
				}else{
					configuration.enumerable = true;
				}

				if( regexReadOnly.test( options )
					&& !regexWritable.test( options ) )
				{
					configuration.writable = false;
				}else if( regexWritable.test( options )
					&& !regexReadOnly.test( options ) )
				{
					configuration.writable = true;
				}else{
					configuration.writable = true;
				}

				if( regexConstant.test( options )
					&& !regexReadOnly.test( options )
					&& !regexWritable.test( options ) )
				{
					configuration.configurable = false;
					configuration.writable = false;
				}else{
					configuration.configurable = true;
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

			options.value = value;

			Object.defineProperty( this, key, options );

			return this;			
		}
	} );