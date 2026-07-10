'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import OrderSelectionModal from './OrderSelectionModal'
import EditModal from './EditModal'
import { createProductionPlansBatchAction, getProductPhysicalMolds } from '@/app/actions/production'

export const PlanningContext = React.createContext<{
    onCellClick: (machineId: string, dateStr: string, shift: 'DAY'|'NIGHT') => void
    onPlanClick: (plan: any) => void
    selectedOrders: string[]
    selectedCell: { machineId: string, dateStr: string, shift: 'DAY'|'NIGHT' } | null
}>({
    onCellClick: () => {},
    onPlanClick: () => {},
    selectedOrders: [],
    selectedCell: null
})

export default function PlanningClickWrapper({ 
    children, 
    pendingItems, 
    machines, 
    operators 
}: { 
    children: React.ReactNode, 
    pendingItems: any[], 
    machines: any[], 
    operators: any[] 
}) {
    const router = useRouter()
    
    // State quản lý UI
    const [selectedCell, setSelectedCell] = useState<{ machineId: string, dateStr: string, shift: 'DAY'|'NIGHT' } | null>(null)
    const [selectedOrders, setSelectedOrders] = useState<string[]>([])
    const [editingPlan, setEditingPlan] = useState<{ planId: string, planData: any } | null>(null)
    const [panelOpen, setPanelOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Handlers
    const handleCellClick = (machineId: string, dateStr: string, shift: 'DAY'|'NIGHT') => {
        setSelectedCell({ machineId, dateStr, shift })
        setPanelOpen(true)
    }

    const handlePlanClick = (plan: any) => {
        setEditingPlan({ planId: plan.id, planData: plan })
    }

    const handleToggleOrder = (orderItemId: string) => {
        setSelectedOrders(prev => 
            prev.includes(orderItemId) 
                ? prev.filter(id => id !== orderItemId)
                : [...prev, orderItemId]
        )
    }

    const handleConfirmSelection = async () => {
        if (!selectedCell || selectedOrders.length === 0) return
        
        setIsSubmitting(true)
        try {
            const payloads = []
            for (const orderId of selectedOrders) {
                const item = pendingItems.find(p => p.order_item_id === orderId)
                if (!item) continue
                
                // Lấy default mold nếu có
                const molds = await getProductPhysicalMolds(item.detail?.product_id || '')
                const defaultMoldId = molds && molds.length > 0 ? molds[0].id : null

                payloads.push({
                    order_item_id: orderId,
                    machine_instance_id: selectedCell.machineId,
                    mold_physical_id: defaultMoldId,
                    planned_date: selectedCell.dateStr,
                    planned_quantity: item.total_requested_qty - item.total_planned_qty,
                    shift: selectedCell.shift,
                })
            }
            
            if (payloads.length > 0) {
                await createProductionPlansBatchAction(payloads)
            }
            
            setPanelOpen(false)
            setSelectedOrders([])
            setSelectedCell(null)
            router.refresh()
        } catch (err: any) {
            alert(err.message)
        }
        setIsSubmitting(false)
    }

    const contextValue = {
        onCellClick: handleCellClick,
        onPlanClick: handlePlanClick,
        selectedOrders,
        selectedCell
    }

    return (
        <PlanningContext.Provider value={contextValue}>
            <div className="flex w-full h-full relative overflow-hidden">
                {/* Main Area */}
                <div className="flex-1 overflow-auto h-full relative z-0">
                    {children}
                </div>

                {/* Modal Chọn Đơn Hàng */}
                {panelOpen && (
                    <OrderSelectionModal 
                        pendingItems={pendingItems}
                        selectedOrders={selectedOrders}
                        selectedCell={selectedCell}
                        machineCode={machines.find(m => m.id === selectedCell?.machineId)?.internal_code}
                        onToggle={handleToggleOrder}
                        onConfirm={handleConfirmSelection}
                        onClose={() => {
                            setPanelOpen(false)
                            setSelectedOrders([])
                        }}
                        isSubmitting={isSubmitting}
                    />
                )}

                {/* Modal Chỉnh Sửa */}
                {editingPlan && (
                    <EditModal 
                        planData={editingPlan.planData}
                        machine={machines.find(m => m.id === editingPlan.planData.machine_instance_id)}
                        operators={operators}
                        onClose={() => setEditingPlan(null)}
                        onSuccess={() => {
                            setEditingPlan(null)
                            router.refresh()
                        }}
                    />
                )}
            </div>
        </PlanningContext.Provider>
    )
}
