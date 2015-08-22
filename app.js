DOCUMENTATION_FOLDER = '/learning-resources/';

angular.module('JuliusAkula',['ui.bootstrap', 'ui.router', 'ngClipboard', 'yaru22.md']).config(['ngClipProvider', '$stateProvider', '$urlRouterProvider', function(ngClipProvider, $stateProvider, $urlRouterProvider){
    
    $urlRouterProvider.otherwise("/");
    $stateProvider.state('index', {
        url: "/",
        templateUrl: 'src/views/homepage.tpl.html',
        controller: function($scope){
            $scope.btns = "btn btn-";
            $scope.types = [
            {
                type: 'default',
                message: 'Default Dialog'
            },
            {
                type: 'danger',
                message: 'Danger Dialog'
            },
            {
                type: 'primary',
                message: 'Primary Dialog'
            },
            {
                type: 'success',
                message: 'Success Dialog'
            },
            {
                type: 'warning',
                message: 'Warning Dialog'
            },
            {
                type: 'info',
                message: 'Info Dialog'
            }];
        }
    });
    ngClipProvider.setPath("node_modules/zeroclipboard/dist/ZeroClipboard.swf");

}]).controller('MarkdownRepeaterCtrl', function($scope, $http, $timeout, ReadmeService){
    $scope.isCollapsed = false;
    $scope.toggleCollapse = function(){
        $scope.isCollapsed = !$scope.isCollapsed;
    };
    $scope.text = '';
    $scope.$watch('text', function(newVal, oldVal){
        if(oldVal == '' && newVal != ''){
            // parse the text, get list of stuff to parse.
        }
    });    
    
    $scope.readREADME = function(filename){
        $http({method: "GET", url: filename}).success(function(data, status, headers, config) {
            $scope.text = data;
            
            $scope.parseOrder();
        });
    };
    
    $scope.FinalRender = '';
    $scope.readyToFinalize = false;
    $scope.FinalRenderData = {};
    $scope.numLinks = 0;
    $scope.FinalRenderData.numBulletPoints = 0;
    $scope.FinalRenderData.numTotalRequests = 0; // know when to stop.
    $scope.FinalRenderData.sentRequests = [];
        
    $scope.parseOrder = function(){
        // README.md, raw text is accessible via $scope.text. Search for `## Contents`. Each newline, if it begins with 1. ; is a "Section", and can be a "subsection" if it has two spaces and then `1.`
        
        // current task print out only those lines
        var begin = $scope.text.indexOf('## Contents');
        contentsList = $scope.text.substr(begin);
        arrayOfLines = contentsList.match(/[^\r\n]+/g); // would capture a blank newline http://stackoverflow.com/a/5035058/3100494
        for(line in arrayOfLines){
            var thisLine = arrayOfLines[line];
            if(line==0){
                $scope.text='';
            }
            var isBulletPoint = thisLine.indexOf('1.');
            var hasLink = thisLine.indexOf('](');
            
            if(isBulletPoint > -1){
                
                // move to sentTopLevelRequests area a few lines down?
                if(isBulletPoint == 0){
                    // Top level section, "Fundamentals, Developer tools"
                    
                }
                else if(isBulletPoint == 2){
                    
                }
                else{
                    // ... ?
                }
                
                $scope.numBulletPoints++;
                
                
                if(isBulletPoint >= 0){
                    console.log(thisLine)
                    // Main section. Give it a big title, and list the links
                    
                    // count of links counted after HTTP parse
                    
                    // get link
                    if(hasLink > -1){
                        theLink = thisLine.substr(2);
                        theLink = theLink.substr(hasLink, thisLine.indexOf(")") - 2)                        
                        theLink = DOCUMENTATION_FOLDER + theLink.substring(0, theLink.length - 1);
                        console.log(theLink);
                        
                        // increment amount of outgoing requests for top-level bullets, and send that outgoing request, to potentially recieve second-level bullets. When all the top-level are successfully returned, the contents of $scope.text will update to h, and trigger reading the second-level bullets.
                        $scope.FinalRenderData.numTotalRequests++;
                        
                        $scope.FinalRenderData.sentRequests[$scope.numLinks] = { lineNo: $scope.FinalRenderData.numBulletPoints, url: theLink };
    
                        $scope.numLinks++;
                    }
                    //does not have link (only the "Future" section)
                    else{
                    }
                   
                }
                
                $scope.text += thisLine+"\n";
            }
            // only add stuff to $scope.text if its in the bullet points parsed out of README.md
        }
        
        
        // goal is then parse out the parenthesis from `](` to the end `)`, that's the Link to parse out however many more links it may contain
        // contained links are in the format
        // * [link of material](www...) By [link to author/org](www...) #book/#article/#video
        $timeout(function(){console.log($scope.FinalRenderData);}, 2000);
    };
    
    
    //$scope.$watch('FinalRenderData', function(newVal, oldVal){
    //    if(newVal!==0 && oldVal !== 0){
    //        // parse the text, get list of stuff to parse.
    //        if($scope.FinalRenderData.numTotalRequests == $scope.FinalRenderData.sentRequests.length){
    //            alert("Wooo!!");
    //            alert($scope.FinalRenderData.numTotalRequests);
    //        }
    //    }
    //});
    
    $scope.readREADME("README.md");
}).factory('ReadmeService', function($http){
    return {
        getReadme: function(url) {
            return $http({method: "GET", url: url}).then(function(data, status, headers, config) {
                return data; })
        }
    }
});