//
//  Essen.h
//  NamNamTouch
//
//  Created by Thomas "fake" Jakobi on 2010-09-25.
//  Copyright 2010 Thomas "fake" Jakobi. All rights reserved.
//

#import <Foundation/Foundation.h>

@class Preis;

@interface Essen : NSObject {
	
	int preis;
	NSString* beschreibung;
	
	BOOL vegetarian;
	BOOL moslem;
	BOOL beef;

}

@property int preis;
@property (nonatomic, strong) NSString *beschreibung;
@property BOOL vegetarian;
@property BOOL moslem;
@property BOOL beef;

-(NSDictionary*)serialize;
+ (Essen*)deserialize:(NSDictionary*)dict;

@end
