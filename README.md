### I.Introduction

```
PathQuest:Advanced PathfindingVisualizerisaninteractivewebapplication
that allows usersto explore and visualize popular pathfindingalgorithms in
action.Theprojectaimstoprovideahands-onexperienceforunderstandingthe
principles behind algorithms such as Dijkstra's Algorithm, A* Search
Algorithm, Breadth-First Search (BFS) etc. The visualizer offers real-time
animationsandinteractivecontrols,makingitavaluabletoolforbothlearning
andexperimentation.
```
```
InPathQuest,userscancreateagrid-basedmapandsetstartandendpointsby
simplydragging anddropping nodes.Additionally,theyhavetheflexibilityto
place custom walls to create unique maze-like structures. The user-friendly
interfaceensuresaseamlessexperienceforinteractingwiththeapplicationand
observingthealgorithmsatwork.
```
```
Theprojectshowcasesarangeoffeatures,includingdynamicvisualizationsthat
illustratehowpathfindingalgorithmsexploreanddiscovertheshortestpathin
realtime.Theanimationsprovideastep-by-stepbreakdownofthealgorithms'
process,allowinguserstograsptheirefficiencyandbehavior.
```
FINALPROJECTREPORT


### II.Functionalities

#### 1.VisualizingDijkstra'sAlgorithm:Theappfeaturesa"VisualizeDijkstra's

```
Algorithm" button that initiatesthe visualization process. Whenclicked,the
algorithmvisuallyexploresthegridtofindtheshortestpathfromtheselected
startnodetotheendnode.
```
#### 2.SelectingStartandEndNodes:Userscaneasilychoosethestartandend

```
nodesanywhereonthegridbyclickingontherespectivecells.Theselectednodes
arevisuallymarkedtoindicatetheirrole.
```
#### 3.CreatingWallsandMazes:Usershavetheflexibilitytodesigncustomwalls

```
ormazesbyclickingongridcells,effectivelyblockingthepathofthealgorithm.
ThisfeatureenhancestheunderstandingofhowDijkstra'salgorithmnavigates
aroundobstacles.
```
#### 4. Animated Search Process: The app employs captivating animations to

```
showcasethealgorithm'ssearchprocess.Asthealgorithmexploresthegrid,it
visuallydemonstrateshowitsearchesfortheoptimalpathstepbystep.
```
5. Shortest PathAnimation:Aftersuccessfully findingtheendnode,theapp
showcasesanotheranimation, clearlymappingouttheshortestpathfromthe
starttotheendnode.Thisanimationvividlyillustratesthepathtraversedbythe
algorithm.

```
ThePathfinderappprovidesanintuitiveandengagingwayforuserstograsp
theprinciplesofDijkstra'salgorithmanditsapplicationsinfindingtheshortest
pathonagrid-basedenvironment.Thecombinationofinteractivefeaturesand
captivatinganimationsmakesitavaluabletoolforlearningandunderstanding
pathfindingalgorithms.
```
FINALPROJECTREPORT


### III.Implementation

```
TheimplementationofthePathfinderapputilizesReactandbasicHTML/CSS
tocreateaninteractiveandvisuallyappealingplatformforexploringDijkstra's
algorithm.
```
```
1.PathFindingVisualizerFolder:
```
- pfv.jsx(PathFindingVisualizer):Thiskeyfilecontainsthemain
implementationoftheapplication.Itcreatesthegrid,initializesallthenodes,
andhandlesthefunctionalities.ItdefinesthevisualizationofDijkstra's
algorithmandtheanimationsforsearchingtheshortestpath.
- pfv.css:ThisCSSfileisresponsibleforstylingthegrid,buttons,andnavbar.
Itensuresacleanandvisuallypleasinginterfaceforaseamlessuserexperience.

```
2.NodeFolder:
```
- Node.jsx:ThisfiledefinestheNodecomponent,representingeachcellonthe
grid.Ithandlesthepropertiesandstatesofeachnode,suchaswhetherit'sthe
startnode,endnode,orawall.Node.jsxplaysacrucialroleinvisualizingthe
algorithm'spathfindingprocess.

```
3.AlgorithmsFolder:
```
- dijkstra.js:Thedijkstra.jsfilecontainstheimplementationoftheDijkstra's
algorithm.Itcalculatestheshortestpathonthegrid,consideringstartandend
nodes,whileavoidingobstaclesrepresentedaswalls.Thealgorithm'scorelogic
liesinthisfile.

```
ThePathfinderapp'ssignificanceliesinitsinteractivenature,whichallowsusers
toactivelyparticipateintheexplorationofDijkstra'salgorithm.Theanimations
providedbypfv.cssandNode.cssenhanceuserunderstandingbyvisually
illustratingthesearchprocessandtheshortestpath'sdiscovery.Theclear
separationofcomponentsintodifferentfilesfacilitateseasymaintenanceand
scalabilityoftheproject.Theimplementationthusprovidesauser-friendlyand
educationalplatformtocomprehendtheintricaciesofDijkstra'salgorithmand
itsapplicationsinpathfinding.
```
FINALPROJECTREPORT


### IV.Snapshots:

```
BelowaresomesnapshotsofthePathfinderwebapplication:
```
```
1.HomePage:
```
FINALPROJECTREPORT


```
2.StartandEndNodeSelected:
```
```
3.MazeCreation:
```
FINALPROJECTREPORT


```
4.ShortestPathVisualization:
```
FINALPROJECTREPORT


FINALPROJECTREPORT


```
5.ShortestPath:
```
FINALPROJECTREPORT
