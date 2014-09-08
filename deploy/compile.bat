@echo OFF

echo -----------------------------------------------------------------
echo COMPILING...
echo -----------------------------------------------------------------
cd cc_v03
python compiler.py index_dev.htm index.htm
timeout 20