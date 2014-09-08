



import os, re, sys, getopt;

class MacroStatement:
	ins = "";
	arg = "";
	def __init__(self, line):
		
		# remove any carriage returns from the end of the line.
		line_wo_cr = line.replace("\n","").replace("\r","");
		
		# remove any leading spaces or tabs.
		while len(line_wo_cr)>0 and (line_wo_cr[0] == "\t" or line_wo_cr[0] == " "):
			line_wo_cr = line_wo_cr[1:];
		
		if(len(line_wo_cr) == 0):
			return
		
		line_macro = line.split(" ")[0];
		if line_macro[0:3] == "///" or line_macro[0:4] == "<!--":
			# we have an instruction.
			
			#get and store the instruction ins and arg:
			if line_macro[0:3] == "///":
				self.ins = line_macro[3:];
				self.arg = " ".join(line.split(" ")[1:]);
			else:
				self.ins = line_macro[4:];
				self.arg = " ".join(line.split(" ")[1:])[:-3]; #remove the -->


#for dir,dirs,files in os.walk("."):
#	if "main.js" in files:
#		maindir = dir;

		

crawled = []; #will be used to check that files are not crawled twice.

def crawl(arg_path, arg_filename):
	
	fullpathstring = os.path.join(arg_path,arg_filename);
	
	# check if we have already crawled this file.
	if fullpathstring in crawled:
		print("Already crawled "+ fullpathstring);
		return "";
	else:
		print("Crawling "+fullpathstring);
		crawled.append(fullpathstring);
		
	
	
	
	typeoffile = ""; #will be used to store the type of file we are currently inside.
	# determine the type of file we are crawling based on the extension. Supported types are HTML or JS
	if arg_filename[-4:].upper()=="HTML" or arg_filename[-3:].upper()=="HTM":
		typeoffile = "HTML";
	elif arg_filename[-2:].upper()=="JS":
		typeoffile = "JS";
	
	
	
	curfile = ""; # will hold the contents of the output of this file;
	
	
	
	# add a line in the output to show what we are busy crawling.
	if(typeoffile == "JS"):
		curfile+= "\n\n\n// #########\t\t Crawling:"+fullpathstring+"\t\t#########\n";
	elif (typeoffile == "HTML"):
		curfile+= "\n\n\n<!--#########\t\t Crawling:"+fullpathstring+"\t\t#########-->\n";
	else:
		print("ERROR: unable to determine the type of file based on extension. .htm .html or .js");
		return "error";
	
	
	# Open the file specified in the arguments
	mf = open(arg_path+"\\"+arg_filename, "r");
	
	mflist = []; #will be used to store array of lines read from the file
	#read the lines from the file.
	for line in mf:
		mflist.append(line);
	
	
	i = 0;
	
	ignorelines = False;
	
	while i<len(mflist):
		line = mflist[i];
		
		#get the macro statement of the line:
		macro = MacroStatement(line);
		
		if macro.ins == "inc" or macro.ins == "*":
			# INCLUDE FILE - USE RELATIVE PATH
			importingfolder	= os.path.join(arg_path,os.path.split(macro.arg)[0]);
			importingfile	= os.path.split(line[5:].replace("\n",""))[1];
			curfile+= crawl(importingfolder,importingfile);
		elif macro.ins == "inc_abs" or macro.ins == "~":
			# INCLUDE FILE - USE ABSOLUTE PATH
			importingfolder	= os.path.join(".",os.path.split(macro.arg)[0]);
			importingfile	= os.path.split(line[5:].replace("\n",""))[1];
			curfile+= crawl(importingfolder,importingfile);
		elif macro.ins == "ignore_next_line":
			i+=1;
			print("IGNORE NEXT LINE");
		elif macro.ins == "ignore_begin":
			print("IGNORE BEGIN")
			ignorelines = True;
		elif macro.ins == "ignore_end":
			print("IGNORE END")
			ignorelines = False;
		else:
			if not ignorelines:
				curfile += filterLines(line);
		i+=1;
		#end while loop
	
	mf.close();
	
	
	return curfile+"\n\n\n";




def filterLines(line):
	#return line;
	result = line;
	# we dont like leading tabs or spaces. Lets get rid of them
	while len(result)>0 and (result[0] == "\t" or result[0] == " "):
		result = result[1:];
	
	# we dont like blank lines. Let's get rid of them.
	if re.match("\A\s+[\r\n]{0,2}\Z",result) != None:
		# this line is blank and consists of cariage returns only:
		return "";
	else:
		# this line is ok. Return it as-is.
		return result;

def main():
	print("Python started...");
	if len(sys.argv)>1:
		result=crawl(".",sys.argv[1]);
		try:
			resfile = open(".".join(sys.argv[1].split(".")[:-1])+"_compiled."+sys.argv[1].split(".")[-1],"w");
			resfile.write(result);
			print("\ndone.");
			print(crawled)
		except err:
			print("failed to write compiled result to file");
			print(err);
		finally:
			resfile.close();
	else:
		print("usage $>python compile2.py [filename]");



#runmain
main()