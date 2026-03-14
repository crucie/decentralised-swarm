// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MapLedger {
    struct Point {
        string agentId;
        int256 x;
        int256 y;
        int256 z;
        uint256 timestamp;
    }

    Point[] public mapPoints;
    
    // Store the last known point per agent for velocity/proximity validation
    mapping(string => Point) public lastKnownPosition;

    event NewPointAdded(
        string agentId,
        int256 x,
        int256 y,
        int256 z,
        uint256 timestamp
    );

    // Maximum speed (distance units per second) to prevent "teleporting"
    // For a 16-bit retro grid, let's say 5 units max per second
    uint256 public constant MAX_SPEED = 5;

    function addMapPoint(string memory _agentId, int256 _x, int256 _y, int256 _z) public {
        uint256 currentTime = block.timestamp;
        
        Point memory lastPoint = lastKnownPosition[_agentId];
        
        // If the agent has a previous point, validate velocity
        if (lastPoint.timestamp != 0) {
            uint256 timeElapsed = currentTime - lastPoint.timestamp;
            
            // Calculate Manhattan distance as a simple proxy for our 16-bit grid
            uint256 distanceX = abs(_x - lastPoint.x);
            uint256 distanceY = abs(_y - lastPoint.y);
            uint256 distanceZ = abs(_z - lastPoint.z);
            uint256 totalDistance = distanceX + distanceY + distanceZ;
            
            // Allow if timeElapsed is 0 (same block) but distance is 0, or check speed
            if (timeElapsed > 0) {
                uint256 speed = totalDistance / timeElapsed;
                require(speed <= MAX_SPEED, "Velocity validation failed: Agent moving too fast");
            } else {
                require(totalDistance == 0, "Velocity validation failed: Multiple points in same block");
            }
        }
        
        Point memory newPoint = Point({
            agentId: _agentId,
            x: _x,
            y: _y,
            z: _z,
            timestamp: currentTime
        });

        mapPoints.push(newPoint);
        lastKnownPosition[_agentId] = newPoint;

        emit NewPointAdded(_agentId, _x, _y, _z, currentTime);
    }
    
    function getAllPoints() public view returns (Point[] memory) {
        return mapPoints;
    }

    // Helper for absolute value
    function abs(int256 n) internal pure returns (uint256) {
        return uint256(n >= 0 ? n : -n);
    }
}
