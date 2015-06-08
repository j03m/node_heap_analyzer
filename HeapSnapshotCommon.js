/*
 * Copyright (C) 2014 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

HeapSnapshotProgressEvent = {
    Update: "ProgressUpdate",
    BrokenSnapshot: "BrokenSnapshot"
};

HeapSnapshotCommon = {
}

HeapSnapshotCommon.baseSystemDistance = 100000000;

/**
 * @param {!Array.<!HeapSnapshotCommon.SerializedAllocationNode>} nodesWithSingleCaller
 * @param {!Array.<!HeapSnapshotCommon.SerializedAllocationNode>} branchingCallers
 * @constructor
 */
HeapSnapshotCommon.AllocationNodeCallers = function(nodesWithSingleCaller, branchingCallers)
{
    /** @type {!Array.<!HeapSnapshotCommon.SerializedAllocationNode>} */
    this.nodesWithSingleCaller = nodesWithSingleCaller;
    /** @type {!Array.<!HeapSnapshotCommon.SerializedAllocationNode>} */
    this.branchingCallers = branchingCallers;
}

/**
 * @param {number} nodeId
 * @param {string} functionName
 * @param {string} scriptName
 * @param {number} scriptId
 * @param {number} line
 * @param {number} column
 * @param {number} count
 * @param {number} size
 * @param {number} liveCount
 * @param {number} liveSize
 * @param {boolean} hasChildren
 * @constructor
 */
HeapSnapshotCommon.SerializedAllocationNode = function(nodeId, functionName, scriptName, scriptId, line, column, count, size, liveCount, liveSize, hasChildren)
{
    /** @type {number} */
    this.id = nodeId;
    /** @type {string} */
    this.name = functionName;
    /** @type {string} */
    this.scriptName = scriptName;
    /** @type {number} */
    this.scriptId = scriptId;
    /** @type {number} */
    this.line = line;
    /** @type {number} */
    this.column = column;
    /** @type {number} */
    this.count = count;
    /** @type {number} */
    this.size = size;
    /** @type {number} */
    this.liveCount = liveCount;
    /** @type {number} */
    this.liveSize = liveSize;
    /** @type {boolean} */
    this.hasChildren = hasChildren;
}

/**
 * @param {string} functionName
 * @param {string} scriptName
 * @param {number} scriptId
 * @param {number} line
 * @param {number} column
 * @constructor
 */
HeapSnapshotCommon.AllocationStackFrame = function(functionName, scriptName, scriptId, line, column)
{
    /** @type {string} */
    this.functionName = functionName;
    /** @type {string} */
    this.scriptName = scriptName;
    /** @type {number} */
    this.scriptId = scriptId;
    /** @type {number} */
    this.line = line;
    /** @type {number} */
    this.column = column;
}

/**
 * @constructor
 * @param {number} id
 * @param {string} name
 * @param {number} distance
 * @param {number} nodeIndex
 * @param {number} retainedSize
 * @param {number} selfSize
 * @param {string} type
 */
HeapSnapshotCommon.Node = function(id, name, distance, nodeIndex, retainedSize, selfSize, type)
{
    this.id = id;
    this.name = name;
    this.distance = distance;
    this.nodeIndex = nodeIndex;
    this.retainedSize = retainedSize;
    this.selfSize = selfSize;
    this.type = type;

    this.canBeQueried = false;
    this.detachedDOMTreeNode = false;
}

/**
 * @constructor
 * @param {string} name
 * @param {!HeapSnapshotCommon.Node} node
 * @param {string} type
 * @param {number} edgeIndex
 */
HeapSnapshotCommon.Edge = function(name, node, type, edgeIndex)
{
    this.name = name;
    this.node = node;
    this.type = type;
    this.edgeIndex = edgeIndex;
};

/**
 * @constructor
 */
HeapSnapshotCommon.Aggregate = function()
{
    /** @type {number} */
    this.count;
    /** @type {number} */
    this.distance;
    /** @type {number} */
    this.self;
    /** @type {number} */
    this.maxRet;
    /** @type {number} */
    this.type;
    /** @type {string} */
    this.name;
    /** @type {!Array.<number>} */
    this.idxs;
}

/**
 * @constructor
 */
HeapSnapshotCommon.AggregateForDiff = function() {
    /** @type {!Array.<number>} */
    this.indexes = [];
    /** @type {!Array.<string>} */
    this.ids = [];
    /** @type {!Array.<number>} */
    this.selfSizes = [];
}

/**
 * @constructor
 */
HeapSnapshotCommon.Diff = function()
{
    /** @type {number} */
    this.addedCount = 0;
    /** @type {number} */
    this.removedCount = 0;
    /** @type {number} */
    this.addedSize = 0;
    /** @type {number} */
    this.removedSize = 0;
    /** @type {!Array.<number>} */
    this.deletedIndexes = [];
    /** @type {!Array.<number>} */
    this.addedIndexes = [];
}

/**
 * @constructor
 */
HeapSnapshotCommon.DiffForClass = function()
{
    /** @type {number} */
    this.addedCount;
    /** @type {number} */
    this.removedCount;
    /** @type {number} */
    this.addedSize;
    /** @type {number} */
    this.removedSize;
    /** @type {!Array.<number>} */
    this.deletedIndexes;
    /** @type {!Array.<number>} */
    this.addedIndexes;

    /** @type {number} */
    this.countDelta;
    /** @type {number} */
    this.sizeDelta;
}

/**
 * @constructor
 */
HeapSnapshotCommon.ComparatorConfig = function()
{
    /** @type {string} */
    this.fieldName1;
    /** @type {boolean} */
    this.ascending1;
    /** @type {string} */
    this.fieldName2;
    /** @type {boolean} */
    this.ascending2;
}

/**
 * @constructor
 */
HeapSnapshotCommon.WorkerCommand = function()
{
    /** @type {number} */
    this.callId;
    /** @type {string} */
    this.disposition;
    /** @type {number} */
    this.objectId;
    /** @type {number} */
    this.newObjectId;
    /** @type {string} */
    this.methodName;
    /** @type {!Array.<*>} */
    this.methodArguments;
    /** @type {string} */
    this.source;
}

/**
 * @constructor
 * @param {number} startPosition
 * @param {number} endPosition
 * @param {number} totalLength
 * @param {!Array.<*>} items
 */
HeapSnapshotCommon.ItemsRange = function(startPosition, endPosition, totalLength, items)
{
    /** @type {number} */
    this.startPosition = startPosition;
    /** @type {number} */
    this.endPosition = endPosition;
    /** @type {number} */
    this.totalLength = totalLength;
    /** @type {!Array.<*>} */
    this.items = items;
}

/**
 * @param {number} nodeCount
 * @param {number} rootNodeIndex
 * @param {number} totalSize
 * @param {number} maxJSObjectId
 * @constructor
 */
HeapSnapshotCommon.StaticData = function(nodeCount, rootNodeIndex, totalSize, maxJSObjectId)
{
    /** @type {number} */
    this.nodeCount = nodeCount;
    /** @type {number} */
    this.rootNodeIndex = rootNodeIndex;
    /** @type {number} */
    this.totalSize = totalSize;
    /** @type {number} */
    this.maxJSObjectId = maxJSObjectId;
}

/**
 * @constructor
 */
HeapSnapshotCommon.Statistics = function()
{
    /** @type {number} */
    this.total;
    /** @type {number} */
    this.v8heap;
    /** @type {number} */
    this.native;
    /** @type {number} */
    this.code;
    /** @type {number} */
    this.jsArrays;
    /** @type {number} */
    this.strings;
    /** @type {number} */
    this.system;
}


/**
 * @param {number=} minNodeId
 * @param {number=} maxNodeId
 * @constructor
 */
HeapSnapshotCommon.NodeFilter = function(minNodeId, maxNodeId)
{
    /** @type {number|undefined} */
    this.minNodeId = minNodeId;
    /** @type {number|undefined} */
    this.maxNodeId = maxNodeId;
    /** @type {number|undefined} */
    this.allocationNodeId;
}

HeapSnapshotCommon.NodeFilter.prototype =
{
    /**
     * @param {!HeapSnapshotCommon.NodeFilter} o
     * @return {boolean}
     */
    equals: function(o)
    {
        return this.minNodeId === o.minNodeId && this.maxNodeId === o.maxNodeId && this.allocationNodeId === o.allocationNodeId;
    }
}

/**
 * @param {string} query
 * @param {boolean} caseSensitive
 * @param {boolean} isRegex
 * @param {boolean} shouldJump
 * @param {boolean} jumpBackward
 * @constructor
 */
HeapSnapshotCommon.SearchConfig = function(query, caseSensitive, isRegex, shouldJump, jumpBackward)
{
    this.query = query;
    this.caseSensitive = caseSensitive;
    this.isRegex = isRegex;
    this.shouldJump = shouldJump;
    this.jumpBackward = jumpBackward;
}

if (module && module.exports){
    exports.HeapSnapshotCommon = HeapSnapshotCommon;
}