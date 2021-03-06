//
//  Tagesmenue.m
//  NamNamTouch
//
//  Created by Thomas "fake" Jakobi on 2010-09-25.
//  Copyright 2010 Thomas "fake" Jakobi. All rights reserved.
//

#import "Tagesmenue.h"
#import "Essen.h"
#import "Mensaessen.h"

@implementation Tagesmenue

@synthesize tag, menues;

-(NSDictionary*)serialize {
	NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithCapacity:2];
	[dict setValue:tag forKey:@"tag"];
	
	NSMutableArray* ms = [[NSMutableArray alloc] initWithCapacity:menues.count];
	
	NSEnumerator* msEnum = [menues objectEnumerator];
	id m;
	while(m = [msEnum nextObject]) {
		[ms addObject:[m serialize]];
	}
	
	[dict setValue:ms forKey:@"menues"];

	msEnum = nil;
	m = nil;
	ms = nil;
	
	
	return dict;
}

+ (Tagesmenue*)deserialize:(NSDictionary*)dict {
	
	Tagesmenue* ret = [[Tagesmenue alloc] init];
	ret.tag = [[dict objectForKey:@"tag"] copy];
	
	NSArray* ms = [dict objectForKey:@"menues"];
	NSMutableArray* mar = [[NSMutableArray alloc] initWithCapacity:ms.count];
	
	NSEnumerator* en = [ms objectEnumerator];
	NSDictionary* md;
	while(md = [en nextObject]) {
		if([md valueForKey:@"studentenPreis"] == nil) {
			[mar addObject:[Essen deserialize:md]];
		} else {
			[mar addObject:[Mensaessen deserialize:md]];
		}
	}
	[ret setMenues:mar];
	
	en = nil;
	md = nil;
	mar = nil;
	
	return ret;
}



@end
