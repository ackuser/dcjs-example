### dcjs-example

###### dcjs overview

* [dcjs-presentation-1]
* [dcjs-presentation-2]

##### Datasets Information from [Wikipedia] & [datos.gob.es]

### See it in [bl.ocks] for better visualization

  [bl.ocks]:
  <http://bl.ocks.org/ackuser/0ac0f61324118dbaa896baafe86ebfac>

  [dcjs-presentation-1]:
  <https://ackuser.github.io/dcjs-presentation-1>

  [dcjs-presentation-2]:
  <https://ackuser.github.io/dcjs-presentation-2>

  [datos.gob.es]: <http://datos.gob.es/catalogo/contratos-municipios>

  [Wikipedia]: <https://es.wikipedia.org/w/index.php?title=Anexo:Provincias_y_ciudades_aut%C3%B3nomas_de_Espa%C3%B1a>

### Commands help


```
 iconv -f "windows-1252" -t "UTF-8" contratos-spain.csv -o contratos-spain-norm.csv
```
```
 dos2unix contratos-spain-norm.csv
```
```
 awk '{print $0","}' contratos-spain-norm.csv  > contratos-spain-norm.csv
```
```
 sed -i 's/Navarra/Comunidad Foral de Navarra/g' contratos.csv
```
```
 awk -F'\t' {'print $7'} spain-provinces-population.tsv | sort | uniq
```
