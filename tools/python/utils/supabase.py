import os
from typing import Dict, List, Any, Optional
from datetime import datetime
from supabase import create_client, Client

class SupabaseClient:
    """
    A client for interacting with Supabase database.
    This utility handles all database operations for the AI Open Agents platform.
    """
    
    def __init__(self, api_url: str = None, api_key: str = None):
        """
        Initialize the Supabase client with API credentials.
        
        Args:
            api_url: Supabase API URL
            api_key: Supabase API Key
        """
        self.api_url = api_url or os.getenv("SUPABASE_API_URL")
        self.api_key = api_key or os.getenv("SUPABASE_API_KEY")
        
        if not self.api_url or not self.api_key:
            raise ValueError("Supabase API URL and API Key must be provided")
        
        self.client = create_client(self.api_url, self.api_key)
    
    def health_check(self) -> bool:
        """
        Check if the Supabase connection is working.
        
        Returns:
            bool: True if connection is successful
        """
        try:
            # Simple query to check connection
            self.client.table("environmental_data").select("id").limit(1).execute()
            return True
        except Exception as e:
            raise Exception(f"Supabase connection failed: {str(e)}")
    
    def store_environmental_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Store environmental data in the database.
        
        Args:
            data: Dictionary containing environmental data
                - location: str
                - data_type: str
                - value: float
                - timestamp: str (optional, defaults to current time)
                - source: str (optional)
                - notes: str (optional)
        
        Returns:
            Dict: The stored data with generated ID
        """
        # Set timestamp if not provided
        if not data.get("timestamp"):
            data["timestamp"] = datetime.now().isoformat()
        
        try:
            result = self.client.table("environmental_data").insert(data).execute()
            
            # Return the first inserted record
            if result.data and len(result.data) > 0:
                return result.data[0]
            else:
                raise Exception("No data returned after insert")
        except Exception as e:
            raise Exception(f"Failed to store environmental data: {str(e)}")
    
    def get_environmental_data(self, query_params: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Retrieve environmental data based on query parameters.
        
        Args:
            query_params: Dictionary of query parameters
                - location: str (optional)
                - data_type: str (optional)
                - start_date: str (optional)
                - end_date: str (optional)
                - limit: int (optional, defaults to 100)
        
        Returns:
            List[Dict]: List of environmental data records
        """
        try:
            query = self.client.table("environmental_data").select("*")
            
            # Apply filters if provided
            if query_params.get("location"):
                query = query.eq("location", query_params["location"])
            
            if query_params.get("data_type"):
                query = query.eq("data_type", query_params["data_type"])
            
            if query_params.get("start_date"):
                query = query.gte("timestamp", query_params["start_date"])
            
            if query_params.get("end_date"):
                query = query.lte("timestamp", query_params["end_date"])
            
            # Apply limit and order by timestamp (newest first)
            limit = query_params.get("limit", 100)
            result = query.order("timestamp", desc=True).limit(limit).execute()
            
            return result.data
        except Exception as e:
            raise Exception(f"Failed to retrieve environmental data: {str(e)}")
    
    def get_environmental_data_summary(
        self, 
        data_type: str,
        location: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get summary statistics for environmental data.
        
        Args:
            data_type: Type of environmental data
            location: Location filter (optional)
            start_date: Start date filter (optional)
            end_date: End date filter (optional)
        
        Returns:
            Dict: Summary statistics including min, max, average, and count
        """
        try:
            # Start building the query
            query = self.client.table("environmental_data").select("*").eq("data_type", data_type)
            
            # Apply additional filters if provided
            if location:
                query = query.eq("location", location)
            
            if start_date:
                query = query.gte("timestamp", start_date)
            
            if end_date:
                query = query.lte("timestamp", end_date)
            
            # Execute the query
            result = query.execute()
            
            # Calculate summary statistics
            if not result.data:
                return {
                    "data_type": data_type,
                    "count": 0,
                    "min": None,
                    "max": None,
                    "average": None
                }
            
            values = [record["value"] for record in result.data]
            
            return {
                "data_type": data_type,
                "count": len(values),
                "min": min(values),
                "max": max(values),
                "average": sum(values) / len(values)
            }
        except Exception as e:
            raise Exception(f"Failed to generate summary statistics: {str(e)}")
    
    # Additional methods for other database operations can be added here
