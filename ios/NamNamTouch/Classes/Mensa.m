//
//  Mensa.m
//  NamNamTouch
//
//  Created by Thomas "fake" Jakobi on 2010-09-25.
//  //  Copyright 2010 Thomas "fake" Jakobi. All rights reserved.
//

#import "Mensa.h"
#import "Tagesmenue.h"
#import "ModelLocator.h"

@implementation Mensa

@synthesize name, firstDate, lastDate, dayMenues, lastUpdate, dateFormat;

-(id) init {
	self = [super init];
	dateFormat = [[NSDateFormatter alloc] init];
    [dateFormat setDateStyle:NSDateFormatterShortStyle];
    [dateFormat setTimeStyle:NSDateFormatterNoStyle];
	[dateFormat setLocale:[[NSLocale alloc] initWithLocaleIdentifier:@"DE"]];
	[dateFormat setDateFormat:@"dd."];
	return self;
}

-(NSArray*)dayMenuIndexArray {
	NSMutableArray* mutArray = [NSMutableArray arrayWithCapacity:[dayMenues count]];
	
	NSEnumerator* dmEnum = [dayMenues objectEnumerator];
	Tagesmenue* tm;
	while(tm = [dmEnum nextObject]) {
		NSString* value = [dateFormat stringFromDate:tm.tag];
		if(![mutArray containsObject:value]) {
			[mutArray addObject:value];
		}
	}
	return mutArray;
}

-(NSDictionary*)serialize {
	NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithCapacity:5];
	[dict setValue:name forKey:@"name"];
	[dict setValue:firstDate forKey:@"firstDate"];
	[dict setValue:lastDate forKey:@"lastDate"];
	[dict setValue:lastUpdate forKey:@"lastUpdate"];
	
	NSMutableArray* days = [[NSMutableArray alloc] initWithCapacity:dayMenues.count];
	
	NSEnumerator* dmEnum = [dayMenues objectEnumerator];
	Tagesmenue* tm;
	while(tm = [dmEnum nextObject]) {
		[days addObject:[tm serialize]];
	}
	
	[dict setValue:days forKey:@"dayMenues"];
	
	return dict;
}

+ (Mensa*)deserialize:(NSDictionary*)dict {

	Mensa* ret = [[Mensa alloc] init];
	ret.lastUpdate = [[dict objectForKey:@"lastUpdate"] copy];
	ret.lastDate = [[dict objectForKey:@"lastDate"] copy];
	ret.firstDate = [[dict objectForKey:@"firstDate"] copy];
	ret.name = [[dict objectForKey:@"name"] copy];
	
	NSArray* dms = [dict objectForKey:@"dayMenues"];
	NSMutableArray* dmar = [[NSMutableArray alloc] initWithCapacity:dms.count];
	
	NSEnumerator* en = [dms objectEnumerator];
	NSDictionary* tmd;
	while(tmd = [en nextObject]) {
		[dmar addObject:[Tagesmenue deserialize:tmd]];
	}
	[ret setDayMenues:dmar];
	
	dms = nil;
	en = nil;
	tmd = nil;
	dmar = nil;
	
	return ret;
}


@end
