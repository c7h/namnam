//
//  MensaURL.m
//  NamNamTouch
//
//  Created by Thomas "fake" Jakobi on 2010-10-09.
//  Copyright 2010 Thomas "fake" Jakobi. All rights reserved.
//

#import "MensaURL.h"


@implementation MensaURL


@synthesize name, url;

- (NSString *)description {
	return name;
}

- (void)dealloc {
	[name release];
	[url release];
    [super dealloc];
}

@end
